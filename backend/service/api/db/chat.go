package db

import (
	"aham/common/c"
	"context"
	"time"

	. "aham/service/api/db/aham/public/table"

	. "github.com/go-jet/jet/v2/postgres"

	"github.com/pkg/errors"
)

type resourceContext string

const (
	CHAT resourceContext = "chat"
	AD   resourceContext = "ad"
)

type Chat struct {
	ID              int64           `json:"id"`
	Title           string          `json:"title,omitempty"`
	Context         resourceContext `json:"context,omitempty"`
	Reference       *int64          `json:"reference,omitempty"`
	ParticipantsIDS []int64         `json:"-"`
	Participants    []UserMin       `json:"participants,omitempty"`
	Archived        []int64         `json:"archived,omitempty"`
	CreatedAt       time.Time       `json:"created_at,omitempty"`
}

type Message struct {
	ID        int64               `json:"id"`
	ChatID    int64               `json:"-"`
	FromID    int64               `json:"-"`
	From      UserMin             `json:"from,omitempty"`
	Message   string              `json:"message,omitempty"`
	Seen      map[int64]time.Time `json:"seen,omitempty"`
	CreatedAt time.Time           `json:"created_at,omitempty"`
}

type ChatAbout struct {
	Context   resourceContext `json:"name"`
	Reference *int64          `json:"reference"`
}

func (chat *Chat) Archive(userID int64) (err error) {

	if GetUserByID(userID) == nil {
		return errors.New("unknown user")
	}

	for _, user := range chat.Archived {
		if user == userID {
			return
		}
	}

	chat.Archived = append(chat.Archived, userID)

	conn := c.DB()
	defer conn.Release()

	cmd, err := conn.Exec(
		context.TODO(),
		`update chats set archived = $1 where id = $2`,
		chat.Archived,
		chat.ID,
	)

	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return errors.New("nothing updated")
	}

	return
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
			(title, context, reference, participants, archived, created_at)
		values
			($1, $2, $3, $4, $5, $6)
		returning id
	`

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
		context.TODO(),
		sql,
		title,
		about.Context,
		about.Reference,
		participants,
		[]int64{},
		now,
	)

	chat = &Chat{
		Title:           title,
		Context:         about.Context,
		Reference:       about.Reference,
		ParticipantsIDS: participants,
		Participants:    usersmin(participants),
		Archived:        []int64{},
		CreatedAt:       now,
	}

	if err := row.Scan(&chat.ID); err != nil {
		return nil, errors.Wrap(err, "can't create chat")
	}

	return
}

func usersmin(users []int64) (items []UserMin) {

	items = make([]UserMin, 0)

	for _, id := range users {
		user := GetUserByID(id)
		if user != nil {
			items = append(items, user.Min())
		}
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
			created_at,
			archived
		from chats
		where id = $1
	`

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
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
		&chat.ParticipantsIDS,
		&chat.CreatedAt,
		&chat.Archived,
	)

	if err != nil {
		c.Log().Error(err)
		return nil
	}

	chat.Participants = usersmin(chat.ParticipantsIDS)

	return
}

func GetChats(userID int64, resourceContext resourceContext, reference int64, archived bool) (chats []*Chat) {

	chats = make([]*Chat, 0)

	var where []BoolExpression = make([]BoolExpression, 0)

	where = append(where, RawBool("participants @> ARRAY[user]::int[]", map[string]interface{}{"user": userID}))
	where = append(where, Chats.Context.EQ(String(string(resourceContext))))

	if reference > 0 {
		where = append(where, Chats.Reference.EQ(Int(reference)))
	}

	/*
		if archived {
			where = append(where, RawBool("archived = @> ARRAY[user]::int[]", map[string]interface{}{"user": userID}))
		} else {
			where = append(where, RawBool("NOT archived @> ARRAY[user]::int[]", map[string]interface{}{"user": userID}))
		}*/

	smtp := Chats.SELECT(
		Chats.ID,
		Chats.Title,
		Chats.Context,
		Chats.Reference,
		Chats.Participants,
		Chats.CreatedAt,
		Chats.Archived,
	).WHERE(
		AND(where...),
	).ORDER_BY(
		Chats.CreatedAt.DESC(),
	)

	conn := c.DB()
	defer conn.Release()

	sql, params := smtp.Sql()

	rows, err := conn.Query(
		context.TODO(),
		sql,
		params...,
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
			&chat.ParticipantsIDS,
			&chat.CreatedAt,
			&chat.Archived,
		)

		chat.Participants = usersmin(chat.ParticipantsIDS)

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

	msg = &Message{ID: 0}

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
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

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
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

	conn := c.DB()
	defer conn.Release()

	rows, err := conn.Query(
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
