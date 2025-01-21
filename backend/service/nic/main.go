package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
)

var domains = []string{

	// aham.ro
	"https://freedns.afraid.org/dynamic/update.php?M3NmYzBDUENmdkhFbHI5MXlqMXk6MjM2ODc0Mjg=",

	// cdn.aham.ro
	"https://freedns.afraid.org/dynamic/update.php?M3NmYzBDUENmdkhFbHI5MXlqMXk6MjM2ODczOTk=",
}

func main() {

	var previous string

	for {

		resp, err := http.Get("https://icanhazip.com/")

		if err != nil {
			log.Fatalln("Error getting public ip: ", err.Error())
			time.Sleep(time.Second * 10)
			continue
		}

		ipd, err := io.ReadAll(resp.Body)

		if err != nil {
			log.Fatalln("Error reading public ip: ", err.Error())
			time.Sleep(time.Second * 10)
			continue
		}

		if previous == string(ipd) {
			time.Sleep(time.Second * 10)
			continue
		}

		previous = string(ipd)

		for _, domain := range domains {

			resp, err := http.Get(
				fmt.Sprintf("%s&address=%s", domain, strings.TrimRight(previous, "\n")),
			)

			if err != nil {
				log.Println("Can't update domain ip: ", err.Error())
				continue
			}

			ups, err := io.ReadAll(resp.Body)

			if err != nil {
				log.Println("Can't read output of ip update")
				continue
			}

			log.Print(string(ups))
		}

		time.Sleep(time.Second * 10)
	}
}
