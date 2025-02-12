import { css } from "@emotion/react";
import { FormControl, FormLabel, Input, Option, Select, Textarea } from "@mui/joy";
import { FC, Ref } from "react";
import { Prop } from "../types";

export interface DPropFormProps {
    prop?: Prop | null;
    formRef: Ref<HTMLFormElement>
    onSubmit: (prop: Prop) => void
}

const DPropForm:FC<DPropFormProps> = ({prop, formRef, onSubmit}) => {
    return (
        <form

            css={css`
                margin-top: 10px;
                > * {
                    margin-bottom: 10px;
                }
            `}

            ref={formRef}

            onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const data = Object.fromEntries((formData as any).entries());
                onSubmit(data as any);
            }}
        >
            <input type="hidden" name="id" value={prop?.id}/>
            <FormControl>
                <FormLabel>Title</FormLabel>
                <Input name="title" value={prop?.title}/>
            </FormControl>
            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input name="name" value={prop?.name}/>
            </FormControl>
            <FormControl>
                <FormLabel>Group</FormLabel>
                <Input name="group" value={prop?.group}/>
            </FormControl>
            <FormControl>
                <FormLabel>Type</FormLabel>
                <Select name="type" value={prop?.type}>
                    <Option value="TEXT">TEXT</Option>
                    <Option value="NUMBER">NUMBER</Option>
                    <Option value="SELECT">SELECT</Option>
                    <Option value="BOOL">BOOL</Option>
                    <Option value="DATE">DATE</Option>
                    <Option value="TIME">TIME</Option>
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>Template</FormLabel>
                <Input name="template" value={prop?.template}/>
            </FormControl>
            <FormControl>
                <FormLabel>Options</FormLabel>
                <Textarea name="options" minRows={3} value={prop?.options ? JSON.stringify(prop?.options) : ''}></Textarea>
            </FormControl>
            <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea name="description" minRows={3} value={prop?.description}></Textarea>
            </FormControl>
        </form>
    )
}

export default DPropForm;