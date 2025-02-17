package db

import (
	"aham/common/c"
	"context"
	"time"

	"github.com/pkg/errors"
)

type resourceContext string

const (
	CHAT resourceContext = "chat"
	AD   resourceContext = "ad"
)

type Chat struct {
	ID           int64           `json:"id"`
	Title        string          `json:"title,omitempty"`
	Context      resourceContext `json:"context,omitempty"`
	Reference    *int64          `json:"reference,omitempty"`
	Participants []int64         `json:"participants,omitempty"`
	CreatedAt    time.Time       `json:"created_at,omitempty"`
}

type Message struct {
	ID        int64               `json:"id"`
	ChatID    int64               `json:"chat_id,omitempty"`
	FromID    int64               `json:"from_id,omitempty"`
	From      UserMin             `json:"from,omitempty"`
	Message   string              `json:"message,omitempty"`
	Seen      map[int64]time.Time `json:"seen,omitempty"`
	CreatedAt time.Time           `json:"created_at,omitempty"`
}

type ChatAbout struct {
	Context   resourceContext `json:"name"`
	Reference *int64          `json:"reference"`
}

func CreateChat(title string, participants []int64, about *ChatAbout) (chat *Chat, err error) {

	if about == nil {
		about = &ChatAbout{
			Context: CHAT,
		}
	}

	now := time.Now()

	sql := `
		insert into chats 
			(title, context, reference, participants, created_at)
		values
			($1, $2, $3, $4, $5)
		returning id
	`

	row := c.DB().QueryRow(
		context.TODO(),
		sql,
		title,
		about.Context,
		about.Reference,
		participants,
		now,
	)

	chat = &Chat{
		Title:        title,
		Context:      about.Context,
		Reference:    about.Reference,
		Participants: participants,
		CreatedAt:    now,
	}

	if err := row.Scan(&chat.ID); err != nil {
		return nil, errors.Wrap(err, "can't create chat")
	}

	return
}

func GetChat(id int64) (chat *Chat) {

	sql := `
		select
			id,
			title,
			context,
			reference,
			participants,
			created_at
		from chats
		where id = $1
	`

	row := c.DB().QueryRow(
		context.TODO(),
		sql,
		id,
	)

	chat = &Chat{}

	err := row.Scan(
		&chat.ID,
		&chat.Title,
		&chat.Context,
		&chat.Reference,
		&chat.Participants,
		&chat.CreatedAt,
	)

	if err != nil {
		c.Log().Error(err)
		return nil
	}

	return
}

func GetChats(userID int64, archived bool) (chats []*Chat) {

	chats = make([]*Chat, 0)

	sql := `
		select
			id,
			title,
			context,
			reference,
			participants,
			created_at
		from chats
		where participants @> ARRAY[$1]::int[]
			and archived = $2
	`

	rows, err := c.DB().Query(
		context.TODO(),
		sql,
		userID,
		archived,
	)

	if err != nil {
		c.Log().Error(err)
		return
	}

	for rows.Next() {

		chat := &Chat{}

		err := rows.Scan(
			&chat.ID,
			&chat.Title,
			&chat.Context,
			&chat.Reference,
			&chat.Participants,
			&chat.CreatedAt,
		)

		if err != nil {
			c.Log().Error(err)
			return nil
		}

		chats = append(chats, chat)
	}

	return
}

func (chat *Chat) CreateMessage(from int64, message string) (msg *Message, err error) {

	now := time.Now()

	msg = &Message{
		ID:        0,
		Message:   message,
		CreatedAt: now,
	}

	row := c.DB().QueryRow(
		context.TODO(),
		`insert into messages (chat,"from",message,created_at)values($1,$2,$3,$4) returning id`,
		chat.ID,
		from,
		message,
		now,
	)

	if err := row.Scan(&msg.ID); err != nil {
		return nil, errors.Wrap(err, "nu am putut crea mesaj")
	}

	msg = GetMessage(msg.ID)

	if msg == nil {
		return nil, errors.New("expected message")
	}

	return msg, nil
}

func GetMessage(id int64) (message *Message) {

	sql := `
		select
			m.id,
			u.id,
			u.given_name,
			u.family_name,
			m.message,
			m.seen,
			m.created_at
		from messages as m
		left join users as u on u.id = m.from
		where m.id = $1
	`

	row := c.DB().QueryRow(
		context.TODO(),
		sql,
		id,
	)

	message = &Message{}

	err := row.Scan(
		&message.ID,
		&message.From.ID,
		&message.From.GivenName,
		&message.From.FamilyName,
		&message.Message,
		&message.Seen,
		&message.CreatedAt,
	)

	if err != nil {
		c.Log().Error(err)
		return nil
	}

	return message
}

func (chat *Chat) GetMessages(offset, limit int64) (messages []*Message) {

	messages = make([]*Message, 0)

	sql := `
		select
			m.id,
			u.id,
			u.given_name,
			u.family_name,
			m.message,
			m.seen,
			m.created_at
		from messages as m
		left join users as u on u.id = m.from
		where m.chat = $1
	`

	rows, err := c.DB().Query(
		context.TODO(),
		sql,
		chat.ID,
	)

	if err != nil {
		c.Log().Error(err)
		return
	}

	for rows.Next() {

		message := &Message{}

		err := rows.Scan(
			&message.ID,
			&message.From.ID,
			&message.From.GivenName,
			&message.From.FamilyName,
			&message.Message,
			&message.Seen,
			&message.CreatedAt,
		)

		if err != nil {
			c.Log().Error(err)
			return nil
		}

		messages = append(messages, message)
	}

	return
}
