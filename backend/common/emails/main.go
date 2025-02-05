package emails

import (
	"aham/common/c"
	"bytes"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/smtp"
	"os"
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
	ActivationURL string `name:"ACTIVATION_URL"`
}

func Welcome(to Recipient, params WelcomeParams) {
	go send(to, "welcome", params)
}

func send(recipient Recipient, template string, params any) {

	smtpHost := "mail.aham.ro"
	smtpPort := "587"
	smtpUser := "info@aham.ro"
	smtpPassword := os.Getenv("SMTP_PASSWORD")

	// Email content
	from := "info@aham.ro"
	to := []string{recipient.Email()}

	subject := "Subject: Test Email\n"
	body := "This is a test email sent from Golang!"

	var buffer bytes.Buffer

	writer := multipart.NewWriter(&buffer)

	// Write the plain text part

	part, err := writer.CreatePart(map[string][]string{
		"Content-Type":              {"text/plain; charset=UTF-8"},
		"Content-Transfer-Encoding": {"7bit"},
	})

	if err != nil {
		c.Log().Infof("Error creating plain text part: ", err)
	}

	io.WriteString(part, body)

	// Create the HTML part
	part, err = writer.CreatePart(map[string][]string{
		"Content-Type":              {"text/html; charset=UTF-8"},
		"Content-Transfer-Encoding": {"7bit"},
	})
	if err != nil {
		log.Fatal("Error creating HTML part: ", err)
	}
	io.WriteString(part, "<strong>strong text</strong>")

	// Close the writer to finalize the message
	writer.Close()

	boundary := fmt.Sprintf(`Content-Type: multipart/alternative; boundary="%s"`, writer.Boundary())

	// Set up the message
	message := []byte(
		"MIME-Version: 1.0\n" +
			boundary + "\n" +
			"From: info@aham.ro\n" +
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

	fmt.Println("Email sent successfully!")
}
