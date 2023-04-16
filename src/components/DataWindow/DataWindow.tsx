import styles from "./DataWindow.module.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Day from "../../types/Day";
import { getDays } from "../../api/firebase";
import closeIcon from "../../assets/close.png";

type DataWindowProps = {
    isOpen: boolean;
    closeWindow: Function;
}

export default function DataWindow(props: DataWindowProps) {

    const [days, setDays] = useState<Day[]>([]);

    ChartJS.register(LinearScale, CategoryScale, BarElement, Tooltip);

    const data = {
        labels: days.map(day => day.date.getDate()),
        datasets: [{
            label: 'Time Spent (minutes)',
            data: days.map(day => day.minutes),
            backgroundColor: 'rgba(75,192,192,0.2)', // Bar color
            borderColor: 'rgba(75,192,192,1)', // Bar border color
            borderWidth: 1 // Bar border width
        }]
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                max: Math.max(...days.map(day => day.minutes)) + 60, // Add 60 minutes buffer to the highest value
                stepSize: 60 // Display y-axis labels in increments of 60
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(item:any){
                        return item.parsed.y + " minutes";
                    }
                }
            }
        }
    };

    useEffect(() => {
        getDays().then(newDays => {
            console.log(newDays);
            setDays(newDays);
        })
    }, [props.isOpen]);

    function onCloseClick() {
        props.closeWindow();
    }

    return (
        <div style={{ display: props.isOpen ? "flex" : "none" }} className={styles["data-window-container"]}>
            <div className={styles["data-window"]}>
                <div className={styles["window-control"]}>
                    <div>Time Spent Focusing</div>
                    <div onClick={onCloseClick} className={styles["window-close-button"]}>
                        <img className={styles["close-button-image"]} src={closeIcon}></img>
                    </div>
                </div>
                <Bar className={styles["chart"]} data={data} options={chartOptions}></Bar>
            </div>
        </div>
    )
}