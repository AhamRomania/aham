package emails

import "fmt"

type Args map[string]any

type To interface {
	ToName() string
	ToEmail() string
}

func Send(to To, template TemplateID, args *Args) {

	fmt.Printf(
		`
		 ------- MAIL -------
		 To: %s <%s>,
		 Template: %s,
		 Args: %v
		 ------- END --------
		 `,
		to.ToName(),
		to.ToEmail(),
		template,
		args,
	)
}
