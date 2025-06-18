"use client";
import { useEffect } from "react";
import { baseServer } from "../../constant";
const SetLinks = () => {
//   const subscriptionUrl = `${baseServer}/subscription`;
  const links = {
    "free-trial": {
      "builder-id": "builder-27f44e2f0f744b7db59769e52a2c6049",
      link: `/email-verify?plan=BASIC&mode=TRIAL`,
    },
  };
  useEffect(() => {
    const trialButton = document.getElementsByClassName(
      links["free-trial"]["builder-id"]
    )[0];
    if (trialButton) {
      trialButton.setAttribute("href", links["free-trial"].link);
    }
  });
  return <></>;
};

export default SetLinks;
