import { f7, Button, Icon, Page, Swiper } from "framework7-react";
import React, { useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import styled from "@emotion/styled";
import Colors from "../../colors";
import { PinkButton } from "../../components/CustomButton";
import { FlexRow } from "../../components/layout";
import useIfOnboarded from "../../hooks/useIfOnboarded";
import LocalDatabase, { OnboardingTypes } from "../../utils/LocalDatabase";
import DiaryPNG from "./diary_onboarding.png";
import OnboardingSlide from "./OnboardingSlide";
import PaperCupsPNG from "./paper_cup_onboarding.png";
import VinylPNG from "./vinyl_onboarding.png";
import SaneBlock from "../../components/SaneBlock";

enum Slide {
  PaperCups,
  Journal,
  MusicPlayer,
}

const AnimatedPage = animated(Page) as React.FC<any>;
const BackButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  background: transparent;
  border: none;
  padding: 20px 10px 0px;
`;

const slides = [
  {
    title: "Paper Cups",
    description: `Have something burning in your chest? Feeling down for no good reason? Look back at the old days where you'd communicate with other people over a simple device - connected paper cups! Let it all out and find a listening ear.`,
    image: PaperCupsPNG,
  },
  {
    title: "Journal",
    description: `Reflecting on your feelings helps you have a more positive outlook and build resilience for tough times. Start a habit of journaling with Halcyon.`,
    image: DiaryPNG,
  },
  {
    title: "Music Player",
    description:
      "Halcyon provides you with a few lo-fi tracks that will help put you at ease and calm you.",
    image: VinylPNG,
  },
];

const OnboardingPage = () => {
  const swiperRef = useRef<any>();
  const [slideNumber, setSlideNumber] = useState<Slide>(Slide.PaperCups);
  const bgColor = useSpring({
    backgroundColor:
      slideNumber === Slide.PaperCups
        ? Colors.secondaryLight
        : slideNumber === Slide.Journal
        ? Colors.tertiaryLight
        : slideNumber === Slide.MusicPlayer
        ? Colors.primaryLighter
        : Colors.tertiaryLight,
  });
  const buttonColor = {
    color:
      slideNumber === Slide.PaperCups
        ? Colors.secondary
        : slideNumber === Slide.Journal
        ? Colors.tertiary
        : slideNumber === Slide.MusicPlayer
        ? Colors.primaryLight
        : Colors.primaryLight,
    shadowColor:
      slideNumber === Slide.PaperCups
        ? Colors.secondaryDark
        : slideNumber === Slide.Journal
        ? Colors.tertiaryDark
        : slideNumber === Slide.MusicPlayer
        ? Colors.primaryDark
        : Colors.primaryDark,
  };

  const onChangeSlide = () => {
    if (!swiperRef.current) {
      return;
    }

    const inst = swiperRef.current;
    setSlideNumber(inst.swiper.activeIndex);
  };

  const isAtStart = slideNumber === 0;
  const isAtEnd = slideNumber === slides.length - 1;

  const onPreviousSlide = () => {
    if (!isAtStart) {
      setSlideNumber((n) => Math.max(n - 1, 0));
    }
  };

  const onNextSlide = () => {
    if (!isAtEnd) {
      setSlideNumber((n) => Math.min(n + 1, slides.length - 1));
    } else {
      LocalDatabase.setOnboarding(OnboardingTypes.App, true);
      f7.views.main.router.navigate("/login");
    }
  };

  useEffect(() => {
    if (!swiperRef.current) {
      return;
    }
    const inst = swiperRef.current.swiper;
    if (inst.activeIndex !== slideNumber) {
      inst.slideTo(slideNumber);
    }
  }, [slideNumber]);

  useIfOnboarded(OnboardingTypes.App, "/");

  return (
    <AnimatedPage name="Onboarding" style={bgColor}>
      <BackButton>
        <Button onClick={onPreviousSlide}>
          {!isAtStart ? <Icon f7="chevron_left" /> : null}
        </Button>
      </BackButton>

      <SaneBlock>
        <Swiper
          ref={swiperRef}
          params={{
            on: {
              slideChange: onChangeSlide,
            },
          }}
        >
          {slides.map((slide, i) => (
            <OnboardingSlide key={i} {...slide} />
          ))}
        </Swiper>

        <FlexRow className="justify-content-flex-end m-4">
          <PinkButton
            {...buttonColor}
            onClick={onNextSlide}
            className="fullwidth"
          >
            {isAtEnd ? "Get started" : "Next"}
          </PinkButton>
        </FlexRow>
      </SaneBlock>
    </AnimatedPage>
  );
};

export default OnboardingPage;
