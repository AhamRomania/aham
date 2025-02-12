"use client"

import { FC, useEffect, useState } from "react";
import { Centred, Space } from "../Layout";
import Link from "next/link";
import style from './style.module.css';
import Tip from "../tooltip";
import Logo from "../logo";
import Image from "next/image";
import { Button, Checkbox, Modal, ModalClose, Sheet, Snackbar, Typography } from "@mui/joy";
import { Paper } from "@mui/material";
import { getLoggedInState } from "../Auth";
import { Check } from '@mui/icons-material';

export interface FooterProps {
    version?: string;
}

const Footer: FC<FooterProps> = ({version}) => {

    const [isLoggedIn,  setIsLoggedIn] = useState(false);
    const [showMobInfo, setShowMobInfo] = useState(false);
    const [mobileOS, setMobileOS] = useState<string>('ios');
    const [showMobOSNotify, setShowMobOSNotify] = useState(false);

    useEffect(() => {
        getLoggedInState().then(setIsLoggedIn);
    }, [mobileOS]);

    const openMobileApp = (os: string) => {
        setMobileOS(os)
        setShowMobInfo(true);
    }

    return (
        <>
            <footer className={style.footer}>
                <Centred padding={0}>
                    <div className={style.menus}>
                        <section>
                            <h4>Aham</h4>
                            <main>
                                <nav className={style.menu}>
                                    <Link href="/despre">Despre</Link>
                                    <Link href="/promovare">Promovează</Link>
                                    <Link href="/categorii">Categorii</Link>
                                    <Link href="/curiozitati">Curiozitati</Link>
                                    <Link href="/contact">Contact</Link>
                                </nav>
                                <nav className={style.menu}>
                                    <Link href="https://blog.aham.ro">Blog</Link>
                                    <Link href="/ajutor">Ajutor</Link>
                                    <Link href="/afla">Află</Link>
                                    <Link href="/developeri">Developeri</Link>
                                </nav>
                                <nav className={style.hideOnDesktop + ' ' + style.menu}>
                                    <Link href="/ajutor">Ajutor</Link>
                                    <Link href="/cookies">Cookies</Link>
                                    <Link href="/termeni-si-conditii">Termeni și condiții</Link>
                                    <Link href="/contact">Contact</Link>
                                </nav>
                            </main>
                        </section>
                        <section>
                            <h4>Aplicații Mobile</h4>
                            <main>
                                <Button variant="plain" onClick={() => openMobileApp('IOS')}>
                                    <Image src="/ios.svg" width={186} height={55} alt="Aham pe IOS"/>
                                </Button>
                                <Button variant="plain" onClick={() => openMobileApp('Android')}>
                                    <Image src="/android.svg" width={186} height={55} alt="Aham pe Android"/>
                                </Button>
                            </main>
                        </section>
                    </div>

                    <div className={style.socials}>

                        <Tip title="Navighează pe X">
                            <Link href="https://x.com/AhamRomania" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
                                    <path
                                        fill="#000"
                                        fillRule="nonzero"
                                        d="M5.333 0A5.333 5.333 0 0 0 0 5.333v21.334A5.333 5.333 0 0 0 5.333 32h21.334A5.333 5.333 0 0 0 32 26.667V5.333A5.333 5.333 0 0 0 26.667 0H5.333Zm1.59 6.857h6.047l4.295 6.103 5.211-6.103h1.905l-6.256 7.325 7.714 10.96h-6.046l-4.983-7.08-6.048 7.08H6.857l7.092-8.301-7.026-9.984Zm2.916 1.524 10.749 15.238h2.335L12.174 8.381H9.84Z"
                                    />
                                </svg>
                            </Link>
                        </Tip>

                        <Tip title="Navighează pe Facebook">
                            <Link href="https://www.facebook.com/AhamRomaniaPage" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
                                    <path
                                    fill="#000"
                                    fillRule="nonzero"
                                    d="M28.19 0H3.81A3.81 3.81 0 0 0 0 3.81v24.38A3.81 3.81 0 0 0 3.81 32h24.38A3.81 3.81 0 0 0 32 28.19V3.81A3.81 3.81 0 0 0 28.19 0Zm-3.047 11.429h-1.524c-1.63 0-2.286.38-2.286 1.523v2.286h3.81l-.762 3.81h-3.048v11.428h-3.81V19.048h-3.047v-3.81h3.048v-2.286c0-3.047 1.524-5.333 4.571-5.333 2.21 0 3.048.762 3.048.762v3.048Z"
                                    />
                                </svg>
                            </Link>
                        </Tip>

                        <Tip title="Navighează pe Instagram">
                            <Link href="https://www.instagram.com/AhamRomania" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
                                    <path
                                    fill="#000"
                                    fillRule="nonzero"
                                    d="M9.455 0C4.24 0 0 4.24 0 9.455v13.09C0 27.76 4.24 32 9.455 32h13.09C27.76 32 32 27.76 32 22.545V9.455C32 4.24 27.76 0 22.545 0H9.455Zm15.272 5.818c.8 0 1.455.655 1.455 1.455s-.655 1.454-1.455 1.454-1.454-.654-1.454-1.454c0-.8.654-1.455 1.454-1.455ZM16 8c4.415 0 8 3.585 8 8s-3.585 8-8 8-8-3.585-8-8 3.585-8 8-8Zm0 1.455A6.555 6.555 0 0 0 9.455 16 6.555 6.555 0 0 0 16 22.545 6.555 6.555 0 0 0 22.545 16 6.555 6.555 0 0 0 16 9.455Z"
                                    />
                                </svg>
                            </Link>
                        </Tip>

                        <Tip title="Navighează pe Pinterest">
                            <Link href="https://www.pinterest.com/AhamRomania" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
                                    <path
                                    fill="#000"
                                    fillRule="nonzero"
                                    d="M16 0C7.178 0 0 7.178 0 16c0 6.876 4.36 12.751 10.46 15.01-.176-1.566-.148-4.131.142-5.373.271-1.167 1.754-7.435 1.754-7.435s-.448-.896-.448-2.22c0-2.08 1.205-3.632 2.706-3.632 1.277 0 1.892.958 1.892 2.107 0 1.284-.816 3.201-1.239 4.979-.353 1.49.747 2.704 2.215 2.704 2.658 0 4.701-2.804 4.701-6.85 0-3.58-2.572-6.084-6.246-6.084-4.255 0-6.753 3.192-6.753 6.49 0 1.286.495 2.664 1.113 3.414.122.149.14.278.104.429-.114.472-.366 1.488-.416 1.696-.065.275-.217.332-.5.2-1.868-.87-3.036-3.6-3.036-5.795 0-4.717 3.427-9.05 9.883-9.05 5.189 0 9.22 3.696 9.22 8.638 0 5.155-3.25 9.303-7.76 9.303-1.516 0-2.94-.788-3.428-1.718 0 0-.75 2.856-.932 3.556-.315 1.21-1.663 3.719-2.339 4.858 1.547.5 3.196.773 4.907.773 8.823 0 16-7.177 16-16 0-8.822-7.177-16-16-16Z"
                                    />
                                </svg>
                            </Link>
                        </Tip>
                    </div>

                    <div className={style.bottom}>
                        <div className={style.bottomMenu}>
                            <em>© {(new Date()).getFullYear()} Aham</em>
                            <i>㆐</i>
                            <nav>
                                <Link href="/confidentialitate">Confidentialitate</Link>
                                <Link href="/cookies">Cookies</Link>
                                <Link href="/termeni-si-conditii">Termeni și condiții</Link>
                            </nav>
                        </div>
                        <Space/>
                        <div className={style.right}>
                            <div className={style.version}>
                                <Link href="/status">
                                    {version}
                                </Link>
                            </div>
                            <Tip title="Navighează la pagina principală">
                                <Link href="/">
                                    <Logo size={32} padding={10} bg="#FFF" color="#000" radius={3} />
                                </Link>
                            </Tip>
                        </div>
                    </div>
                </Centred>
            </footer>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={showMobInfo}
                onClose={() => setShowMobInfo(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                >
                <ModalClose variant="plain" sx={{ m: 1 }} />
                <Typography
                    component="h2"
                    id="modal-title"
                    level="h4"
                    textColor="inherit"
                    sx={{ fontWeight: 'lg', mb: 1 }}
                >
                    Aplicație mobilă
                </Typography>
                <Typography id="modal-desc" textColor="text.tertiary">
                    Ne cerem scuze, aplicația mobilă pentru <strong>{mobileOS}</strong> nu este încă
                    disponibilă.
                    {isLoggedIn && <Paper style={{padding: 20, paddingBottom: 15, marginTop: 20}}>
                        <Checkbox onClick={() => setShowMobOSNotify(true)} label="Trimite un email când este disponibilă."/>
                    </Paper>}
                </Typography>
                </Sheet>
            </Modal>
            <Snackbar
                open={showMobOSNotify}
                variant="solid"
                autoHideDuration={3000}
                onClose={() => setShowMobOSNotify(false)}
            >
                <Check/>
                <span>Opțiunea de notificare a fost salvată</span>
            </Snackbar>
        </>
    )
}

export default Footer