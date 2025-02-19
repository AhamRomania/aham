import { getAdsToApprove, getCategoryProps } from "@/api/ads";
import getApiFetch from "@/api/api";
import { css } from "@emotion/react";
import { Assignment, Close, InfoOutlined, Publish, Remove } from "@mui/icons-material";
import { Button, DialogActions, DialogContent, DialogTitle, IconButton, Modal, ModalDialog, Textarea } from "@mui/joy";
import { FC, useEffect, useState } from "react";
import { Ad, Prop } from "../types";
import AdSpectsListing from "../Widget/AdSpecsListing";
import Gallery from "../Widget/Gallery";

const AdApproving:FC = ({}) => {

    const [items, setItems] = useState<Ad[]>([]);

    const update = () => {
        getAdsToApprove().then(setItems);
    }

    useEffect(() => {
        update();
    }, []);

    return (
        <div>
            {items.map((item, index) => <AdApprovingItem onTouched={() => update()} key={index} ad={item}/>)}
        </div>
    )
}

interface AdApprovingItemProps {
    ad: Ad
    onTouched: () => void;
}

const AdApprovingItem: FC<AdApprovingItemProps> = ({ad, onTouched}) => {
    const api = getApiFetch();
    const [props, setProps] = useState<Prop[]>();
    const [desc, setDesc] = useState<string>('');
    const [requestingUpdate, setRequestingUpdate] = useState<boolean>(false);

    useEffect(() => {
        getCategoryProps(ad.category.id).then(setProps);
    }, []);

    const publish = () => {
        if(confirm('Publish ' + ad.title + '?')) {
            api(`/ads/${ad.id}/publish`,{method:'POST', success: true}).then(
                () => {
                    onTouched();
                }
            ).catch(() => {
                alert(`Can't publish ${ad.title}`);
            });
        }
    }

    const requestUpdate = () => {
        alert(`Not implemented`);
        //setRequestingUpdate(true);
    }

    const reject = () => {
        if(confirm('Reject ' + ad.title + '?')) {
            api(`/ads/${ad.id}/reject`,{method:'POST', success: true}).then(
                () => {
                    onTouched();
                }
            ).catch(() => {
                alert(`Can't reject ${ad.title}`);
            });
        }
    }

    return (
        <>
            <div
                data-ad={ad.id}
                css={css`
                    display: flex;
                    border: 1px solid #DDD;
                    border-radius: 8px;
                    padding: 10px;
                    margin-bottom: 20px;
                `}
            >
                <div
                    css={css`
                        margin-right: 10px;
                        > div {
                            width: 300px; 
                        }
                    `}
                >
                    <Gallery pictures={ad.pictures}/>
                </div>
                <div
                    css={css`
                        flex: 1;
                        > div {
                            font-size: 14px;
                            margin-top: 20px;
                        }
                        h3 {
                            margin-bottom: 5px;
                        }
                    `}
                >
                    <h3>{ad.title}</h3>
                    <p>{ad.description.substr(0, Math.min(50, ad.description.length))}</p>
                    {props && ad && <AdSpectsListing props={props} ad={ad}/>}
                </div>
                <div
                    css={css`
                        display: flex;
                        gap: 10px;
                        flex-direction: column;
                    `}
                >
                    <Button
                        size="lg"
                        variant="soft"
                        onClick={() => setDesc(ad.description)}
                    >
                        <InfoOutlined/>
                        <span style={{marginLeft: 20}}>Details</span>
                    </Button>
                    <Button
                        size="lg"
                        variant="solid"
                        onClick={() => publish()}
                    >
                        <Publish/>
                        <span style={{marginLeft: 20}}>Publish</span>
                    </Button>
                    <Button
                        size="lg"
                        variant="solid"
                        color="warning"
                        onClick={() => requestUpdate()}
                    >
                        <Assignment/>
                        <span style={{marginLeft: 20}}>Request Update</span>
                    </Button>
                    <Button
                        size="lg"
                        variant="solid"
                        color="danger"
                        onClick={() => reject()}
                    >
                        <Remove/>
                        <span style={{marginLeft: 20}}>Reject</span>
                    </Button>
                </div>
            </div>
            {desc !== '' && (
                <Modal open={true} onClose={() => setDesc('')}>
                    <ModalDialog>
                        <DialogTitle>Description</DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={() => setDesc('')}
                            sx={() => ({
                                position: 'absolute',
                                right: 8,
                                top: 8,
                            })}
                            >
                            <Close />
                        </IconButton>
                        <DialogContent>
                            {desc}
                        </DialogContent>
                    </ModalDialog>
                </Modal>
            )}

            {requestingUpdate && (
                <div>
                    <Modal open={true} onClose={() => setRequestingUpdate(false)}>
                        <ModalDialog>
                            <DialogTitle>Request Update</DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={() => setRequestingUpdate(false)}
                                sx={() => ({
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                })}
                                >
                                <Close />
                            </IconButton>
                            <DialogContent>
                                <Textarea minRows={5}/>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setRequestingUpdate(false)}>Request</Button>
                            </DialogActions>
                        </ModalDialog>
                    </Modal>
                </div>
            )}
        </>
    )
}

export default AdApproving;