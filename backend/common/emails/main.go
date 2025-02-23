package emails

import (
	"aham/common/c"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"io"
	"log"
	"mime/multipart"
	"net/smtp"
	"os"
	"strings"
)

type Args map[string]any

type Recipient interface {
	Name() string
	Email() string
	String() string
}

type UserRecipient struct {
	name  string
	email string
}

func (u UserRecipient) Name() string {
	return u.name
}

func (u UserRecipient) Email() string {
	return u.email
}

func (u UserRecipient) String() string {
	return fmt.Sprintf("%s <%s>", u.name, u.email)
}

func NewUserRecipient(name, email string) *UserRecipient {
	return &UserRecipient{name, email}
}

type WelcomeParams struct {
	ActivationURL string `json:"ACTIVATION_URL"`
}

func Welcome(to Recipient, params WelcomeParams) {
	send(to, "welcome", params)
}

type OnAdApprovedProps struct {
	Title string `json:"TITLE"`
	Href  string `json:"HREF"`
}

func OnAdApproved(to Recipient, params OnAdApprovedProps) {
	send(to, "ad.approved", params)
}

type OnAdPublishedParams struct {
	Title string `json:"TITLE"`
	Href  string `json:"HREF"`
}

func OnAdPublished(to Recipient, params OnAdPublishedParams) {
	send(to, "ad.published", params)
}

type OnAdCompletedParams struct {
	Title string `json:"TITLE"`
	Href  string `json:"HREF"`
}

func OnAdCompleted(to Recipient, params OnAdCompletedParams) {
	send(to, "ad.completed", params)
}

type OnChatMessageParams struct {
	Title string `json:"TITLE"`
	From  string `json:"FROM"`
	Href  string `json:"HREF"`
}

func OnChatMessage(to Recipient, params OnChatMessageParams) {
	send(to, "chat.message", params)
}

func send(recipient Recipient, template string, params any) {

	var parmsChanged map[string]any

	if params != nil {
		data, _ := json.Marshal(params)
		_ = json.Unmarshal(data, &parmsChanged)
	} else {
		parmsChanged = make(map[string]any)
	}

	parmsChanged["NAME"] = recipient.Name()

	smtpHost := "mail.aham.ro"
	smtpPort := "587"
	smtpUser := "info@aham.ro"
	smtpPassword := os.Getenv("SMTP_PASSWORD")

	// Email content
	from := "info@aham.ro"
	to := []string{recipient.Email()}

	subject := "Subject: Salut\n"
	//body := "This is a test email sent from Golang!"

	var buffer bytes.Buffer

	writer := multipart.NewWriter(&buffer)

	part, err := writer.CreatePart(map[string][]string{
		"Content-Type":              {"text/plain; charset=UTF-8"},
		"Content-Transfer-Encoding": {"7bit"},
	})

	if err != nil {
		c.Log().Infof("Error creating plain text part: ", err)
	}

	text := &bytes.Buffer{}

	if err := Render(text, "text.txt", "emails/"+template+".txt", parmsChanged); err != nil {
		c.Log().Errorf("Failed to send: %s", err.Error())
		return
	}

	io.WriteString(part, text.String())

	// Create the HTML part
	part, err = writer.CreatePart(map[string][]string{
		"Content-Type":              {"text/html; charset=UTF-8"},
		"Content-Transfer-Encoding": {"7bit"},
	})
	if err != nil {
		log.Fatal("Error creating HTML part: ", err)
	}

	html := &bytes.Buffer{}

	if err := Render(html, "aigen.html", "emails/"+template+".html", parmsChanged); err != nil {
		c.Log().Errorf("Failed to send: %s", err.Error())
		return
	}

	io.WriteString(part, html.String())

	// Close the writer to finalize the message
	writer.Close()

	boundary := fmt.Sprintf(`Content-Type: multipart/alternative; boundary="%s"`, writer.Boundary())

	// Set up the message
	message := []byte(
		"MIME-Version: 1.0\n" +
			boundary + "\n" +
			"From: Aham <info@aham.ro>\n" +
			fmt.Sprintf("To: %s\n", recipient.Email()) +
			subject + "\n" +
			buffer.String(),
	)

	// Set up the authentication for SMTP
	auth := smtp.PlainAuth("", smtpUser, smtpPassword, smtpHost)

	// Send email
	err = smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)

	if err != nil {
		fmt.Println("Error sending email:", err)
		return
	}

	fmt.Println("Email sent successfully to ", recipient.Email())
}

func Render(w io.Writer, layout string, source string, params any) (err error) {

	path := os.Getenv("TEMPLATES")

	parts := strings.Split(source, "/")

	if len(parts) != 2 {
		return errors.New("expected a/b source value")
	}

	tmpls := []string{
		path + "/layouts/" + layout,
		path + "/" + parts[0] + "/" + parts[1],
	}

	t, err := template.ParseFiles(tmpls...)

	if err != nil {
		return err
	}

	return t.ExecuteTemplate(w, parts[1], params)
}
