package cdn

import "testing"

func TestHas(t *testing.T) {

	if !Has("59037c9d-ec3a-4f96-9001-33713694cb5f") {
		t.Fail()
	}
}
