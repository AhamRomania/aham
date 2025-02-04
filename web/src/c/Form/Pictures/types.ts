import getDomain, { Domain } from "@/c/domain";

export abstract class GenericPicture {
    abstract getURL(): string;
    abstract getUUID(): string;
}

export class FilePicture extends GenericPicture {
    
    public file: File;
    private uuid: string = '';

    constructor(file: File) {
        super();
        this.file = file;
    }

    getURL(): string {

        if(this.uuid !== '') {
            return getDomain(Domain.Cdn,'/' + this.uuid);
        }

        return URL.createObjectURL(this.file);
    }

    getUUID(): string {
        return this.uuid;
    }

    setUUID(uuid: string):void {
        this.uuid = uuid;
    }
}

export class UploadedPicture extends GenericPicture {
    
    private uuid: string;

    constructor(uuid: string) {
        super();
        this.uuid = uuid;
    }

    getURL(): string {
        return getDomain(Domain.Cdn,'/' + this.uuid);
    }

    getUUID(): string {
        return this.uuid;
    }
}
