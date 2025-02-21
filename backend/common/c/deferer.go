package c

import (
	"time"
)

type DeferdWorker struct {
	name  string
	job   func(worker *DeferdWorker)
	after time.Time
}

func (worker *DeferdWorker) RunAfter(t time.Time) {
	worker.after = t
}

// Run executes the worker's job if the current time has passed the scheduled time
func (worker *DeferdWorker) Run() {
	worker.job(worker)
}

type DeferedWorkers struct {
	workers []*DeferdWorker
	running bool
}

func NewDeferedWorkers() *DeferedWorkers {
	return &DeferedWorkers{
		workers: make([]*DeferdWorker, 0),
		running: true,
	}
}

func (dw *DeferedWorkers) Push(name string, job func(worker *DeferdWorker)) {
	worker := &DeferdWorker{name: name, job: job}
	dw.workers = append(dw.workers, worker)
}

func (dw *DeferedWorkers) Run() {
	for {

		if !dw.running {
			return
		}

		for _, worker := range dw.workers {
			worker.Run()
		}

		time.Sleep(time.Second)
	}
}

func (dw *DeferedWorkers) Stop() {
	dw.running = false
}
