import { css } from "@emotion/react";
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { FC, useEffect, useRef, useState } from "react";
import { Ad, AdMetrics } from "../types";
import { getAdMetrics } from "@/api/ads";
import { Button } from "@mui/joy";
import Link from "next/link";

export interface AdPanelProps {
    ad: Ad
}

const AdPanel:FC<AdPanelProps> = ({ad}) => {
    const graph = useRef(null);
    const [data, setData] = useState<AdMetrics>();

    useEffect(() => {
        
        if (!graph.current || !data) {
            return;
        }

        const mc = echarts.init(
            graph.current,
            null,
            {
                height: 140,
            },
        );

        mc.setOption({
            xAxis: {
              type: 'category',
              data: ['LU', 'MA', 'MI', 'JO', 'VI', 'SÂ', 'DU']
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: function (value: any) {
                    return parseInt(value);
                }
              }
            },
            textStyle: {
                fontSize: 10,
            },
            grid: {
                top: 20,
                bottom: 27,
                left: 25,
                right: 10,
            },
            series: [
              {
                data: data!.week || [0, 0, 0, 0, 0, 0, 0],
                type: 'bar'
              }
            ],
          })
    }, [data, graph]);

    useEffect(() => {
        getAdMetrics(ad.id).then(setData);
    }, []);

    return (
        <div
            data-ad={ad.id}
            css={css`
                width: 100%;
                height: 100%;
                border-radius: 8px;
                background: #F0F0F0;
                display: flex;
                flex-direction: column;
                padding: 10px; 
            `}
        >
            <div
                css={css`
                    width: 100%;
                    height: 140px;
                    background: #EAEAEA;
                    border-radius: 8px;
                `}
                ref={graph}
            ></div>

            <div
                css={css`
                    margin-top: 10px;
                    display: grid; 
                    grid-template-columns: 1fr 1fr;
                    gap: 10px; 
                    div {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        background: #EAEAEA;
                        border-radius: 8px;
                        strong {
                            padding: 10px;
                            font-size: 37px;
                            font-weight: 200;
                        }
                        span {
                            text-transform: uppercase;
                            font-size: 12px;
                            padding-bottom: 10px;
                        }
                    }    
                `}
            >
                <div>
                    <strong>{data?.views}</strong>
                    <span>Listări</span>
                </div>
                <div>
                    <strong>{data?.messages}</strong>
                    <span>Mesaje</span>
                </div>
                <div>
                    <strong>{data?.favourites}</strong>
                    <span>Favorite</span>
                </div>
                <div>
                    <strong>{dayjs(ad.valid_through).diff(dayjs(),'day')}</strong>
                    <span>Zile afișare</span>
                </div>
            </div>
            <div
                css={css`
                    margin-top: 30px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    button {
                        width: 100%;
                    } 
                `}
            >
                <Link href={`/u/anunturi?ad=${ad.id}`} prefetch={false}>
                    <Button>Editează anunț</Button>
                </Link>
                <Link href={`/u/mesaje?ad=${ad.id}`} prefetch={false}>
                    <Button>Vezi mesaje</Button>
                </Link>
            </div>
        </div>
    )
}

export default AdPanel;