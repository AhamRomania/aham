import LargeHeader from "@/c/LargeHeader";
import { Button } from "@mui/material";
import Input from '@mui/joy/Input';
import { MainLayout } from "@/c/Layout";

export default async function Page() {
    return (
        <MainLayout>
            <div style={{margin:"0 auto", width:1024}}>
                
                <label>Anunt nou</label><br/>
                <Input placeholder="title"/>
                <Button variant="contained">
                    Adaugă anunț
                </Button>
                <br/>
            </div>
        </MainLayout>
    )
}