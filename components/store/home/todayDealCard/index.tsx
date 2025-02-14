"use client";

import Image from "next/image";
import styles from "./todayDealCard.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ClockIcon } from "@/components/icons/svgIcons";

interface IProps {
  productName: string;
  newPrice: number;
  oldPrice: number;
  image: [string, string];
  dealEndTime: Date;
  spec?: string[];
  url: string;
}

const TodayDealCard = ({
  productName,
  newPrice,
  oldPrice,
  image,
  dealEndTime,
  spec = [],
  url,
}: IProps) => {
  const saveAmount = oldPrice - newPrice;
  const [remainedTime, setRemainedTime] = useState<number | null>(null);

  useEffect(() => {
    // Convert dealEndTime to a timestamp
    const dealEndTimestamp = new Date(dealEndTime).getTime();

    const updateRemainingTime = () => {
      const now = new Date().getTime();
      const diff = Math.max(dealEndTimestamp - now, 0);
      setRemainedTime(diff);
    };

    updateRemainingTime(); // Initialize immediately
    const timer = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(timer);
  }, [dealEndTime]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className={styles.dealCard}>
      <Link href={url} className={styles.imgWrapper}>
        <Image alt="" src={image[0]} fill sizes="(max-width:240px)" />
        <Image alt="" src={image[1]} fill sizes="(max-width:240px)" />
      </Link>
      <div className={styles.save}>
        <span>Save </span>
        <span>
          {saveAmount.toLocaleString("en-us", { minimumFractionDigits: 2 })} €
        </span>
      </div>
      <Link href={url}>
        <h3>{productName}</h3>
      </Link>
      <div className={styles.specWrapper}>
        {spec.length > 0 &&
          spec.map((item, index) => <span key={index}>{item}</span>)}
      </div>
      <div className={styles.bottomWrapper}>
        <div className={styles.priceWrapper}>
          <span>
            was{" "}
            {oldPrice.toLocaleString("en-us", {
              useGrouping: true,
              minimumFractionDigits: 2,
            })}{" "}
            €
          </span>
          <span>
            {newPrice.toLocaleString("en-us", {
              useGrouping: true,
              minimumFractionDigits: 2,
            })}{" "}
            €
          </span>
        </div>
        <div className={styles.timeWrapper}>
          <ClockIcon width={14} />
          <span>
            {remainedTime !== null ? formatTime(remainedTime) : "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TodayDealCard;
