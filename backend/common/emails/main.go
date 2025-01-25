package emails

import (
	"aham/common/c"
	"context"
	"fmt"
	"reflect"

	"github.com/mailgun/mailgun-go/v4"
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

func send(to Recipient, template string, params any) {

	mg := mailgun.NewMailgun("mail.aham.ro", c.MAILGUN_KEY)
	mg.SetAPIBase("https://api.eu.mailgun.net/v3")

	m := mailgun.NewMessage("buna@aham.ro", "Bună", "")

	m.AddRecipient(to.String())
	m.SetTemplate(template)
	m.AddTemplateVariable("NAME", to.Name())

	tof := reflect.TypeOf(params)
	vof := reflect.ValueOf(params)

	for i := 0; i < tof.NumField(); i++ {
		m.AddTemplateVariable(
			tof.Field(i).Tag.Get("name"),
			vof.Field(i).Elem().String(),
		)
	}

	ms, id, err := mg.Send(context.TODO(), m)

	if err != nil {
		c.Log().Error(err)
		return
	}

	c.Log().Infof("Mail(%s/%s) to %s", ms, id, to.String())
}
