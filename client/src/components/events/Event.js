import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Container,
  VStack,
  Box,
  Alert,
  Heading,
  Flex,
  Avatar,
  Text,
  Button,
  Spinner,
  AlertIcon,
} from "@chakra-ui/react";
import {
  startDateFormat,
  endDateFormat,
  daysLeftUntilEvent,
  daysLeftInEvent,
  eventBeforeStartDate,
  eventAfterEndDate,
} from "../helper/eventData";
import { HabitsCompleted } from "../helper/habitStats";
import { getTokenFromLocalStorage, userIsAuthenticated } from "../helper/auth";
import Comments from "../Comments";
import Likes from "../Likes";
import HabitCompletions from "../Habits/HabitCompletions";

const Event = () => {
  const [eventData, setEventData] = useState({});
  const { eventId } = useParams();
  const [profileData, setProfileData] = useState({});
  const [eventHabitCompletions, setEventHabitCompletions] = useState([]);
  const [hasError, setHasError] = useState({ error: false, message: "" });
  const [joinError, setJoinError] = useState("");
  const [userHasJoined, setUserHasJoined] = useState();
  const [buttonText, setButtonText] = useState("");
  const [buttonColour, setButtonColour] = useState("");
  const [eventJoined, setEventJoined] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getEventData = async () => {
      try {
        const { data } = await axios.get(`/api/events/${eventId}`);
        setEventData(data);
        console.log(data);
      } catch (err) {
        setHasError({ error: true, message: "Server error" });
      }
    };
    getEventData();
  }, [eventId, buttonText]);

  const changeText = (text) => setButtonText(text);

  useEffect(() => {
    if (!userIsAuthenticated()) {
      setButtonText("Join Event");
      setButtonColour("#ffbb0f");
    }
    const getProfileData = async () => {
      try {
        const res = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        });
        setProfileData(res.data);
        let startButtonText;
        let buttonColourText;
        if (res.data.events.some((event) => event._id === eventId)) {
          startButtonText = "Leave Event";
          buttonColourText = "black";
        } else {
          startButtonText = "Join Event";
          buttonColourText = "#ffbb0f";
        }
        setButtonText(startButtonText);
        setButtonColour(buttonColourText);
      } catch (err) {
        setHasError({ error: true, message: err.message });
      }
    };
    getProfileData();
  }, [eventId]);

  useEffect(() => {
    if (
      profileData.habitCompletions &&
      eventData &&
      Object.keys(eventData).length
    ) {
      const filtered = profileData.habitCompletions.filter(
        (habit) => habit.event === eventData._id
      );
      setEventHabitCompletions(filtered);
    }
  }, [profileData, eventData]);

  useEffect(() => {
    if (profileData.events && eventData) {
      if (profileData.events.some((event) => event._id === eventData._id)) {
        setUserHasJoined(true);
      } else setUserHasJoined(false);
    }
  }, [profileData, eventData]);

  const toAddHabitPage = () => {
    navigate(`/events/${eventId}/AddHabitCompletion`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/events/${eventId}`, profileData, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      });
    } catch (err) {
      console.log("form error ->", joinError);
      setJoinError(err.response.data.message);
    }
    let changeButtonText;
    let buttonColourText;
    let eventJoinedAlert;
    if (buttonText === "Join Event" && userIsAuthenticated()) {
      changeButtonText = "Leave Event";
      buttonColourText = "black";
      eventJoinedAlert = true;
    } else if (buttonText === "Leave Event") {
      changeButtonText = "Join Event";
      buttonColourText = "#ffbb0f";
      eventJoinedAlert = false;
    } else if (buttonText === "Join Event") {
      changeButtonText = "Join Event";
      buttonColourText = "#ffbb0f";
      eventJoinedAlert = false;
      navigate("/register");
    }
    changeText(changeButtonText);
    setButtonColour(buttonColourText);
    setEventJoined(eventJoinedAlert);
  };

  const handleJoinedSubmit = () => {
    setUserHasJoined(true);
  };

  return (
    <>
      {Object.keys(eventData).length ? (
        <>
          <Flex
            zIndex="0"
            p="0"
            mt="10"
            name="wrapper"
            mb="10"
            direction={{ base: "column", md: "row" }}
          >
            <VStack
              display="flex"
              name="content"
              mr="10"
              direction="column"
              width={{ base: "100%", md: "73%" }}
              alignItems="flex-start"
              mb="6"
            >
              <Box name="header" mb="45px">
                <Box name="image" w={{ base: "250px", mb: "450px" }}>
                  <Heading fontSize="6em">{eventData.emoji}</Heading>
                </Box>
                <Box name="headline">
                  <Heading color="white" mt="4" as="h1" size="2xl">
                    {eventData.name}
                  </Heading>
                  <Text mt="5" size="lg" color="second">
                    {eventData.subTitle}
                  </Text>
                </Box>
                <Box mt="6" name="event-owner" display="flex">
                  <Link
                    to={`/profile/${eventData.owner && eventData.owner._id}`}
                  >
                    <Avatar
                      size="md"
                      src={eventData ? eventData.owner.profilePicture : ""}
                    />
                  </Link>
                  <Box ml="3">
                    <Text fontSize="sm" color="second">
                      Created by
                    </Text>
                    <Text fontWeight="bold" color="second">
                      {eventData.owner.firstName} {eventData.owner.lastName}
                    </Text>
                  </Box>
                </Box>
              </Box>
              <Box
                name="description"
                borderWidth="1px"
                width="100%"
                borderRadius="lg"
                p="6"
                bg="#FFFFFF"
                mr="4"
              >
                <Heading size="sm" mb="5">
                  Event description
                </Heading>
                <Text color="gray.500">{eventData.description}</Text>
              </Box>
              <HabitCompletions eventData={eventData} eventId={eventId} />
            </VStack>
            <Flex
              display="flex"
              flexDirection="column"
              width={{ base: "100%", md: "50%" }}
              name="widget"
            >
              <Box
                name="challengers"
                p="8"
                mt="0"
                backgroundColor="#0075ff"
                color="white"
                borderTopRadius="10"
                w="100%"
              >
                <Heading size="sm">
                  Challengers ({eventData.eventMembers.length})
                </Heading>
                <Flex flexWrap="wrap" mt="4" w="100%">
                  {eventData.eventMembers.map((members) => {
                    return (
                      <Link key={members._id} to={`/profile/${members._id}`}>
                        <Avatar mb="4" mr="4" src={members.profilePicture} />
                      </Link>
                    );
                  })}
                </Flex>
              </Box>
              <Flex
                name="actions"
                p="8"
                mt="0"
                bg="white"
                w="100%"
                flexDirection="column"
                alignItems="center"
                boxShadow="2xl"
                borderBottomRadius="10"
              >
                {eventData.isLive && (
                  <Text
                    fontSize={{ base: "12px", md: "16px", lg: "24px" }}
                    fontWeight="bold"
                    textAlign="center"
                  >
                    The challenge<br></br> has {daysLeftInEvent(eventData)} left
                  </Text>
                )}
                {!eventData.isLive && eventBeforeStartDate(eventData) && (
                  <>
                    <Text
                      fontSize={{ base: "12px", md: "16px", lg: "24px" }}
                      fontWeight="bold"
                      textAlign="center"
                    >
                      The challenge<br></br> starts in{" "}
                      {daysLeftUntilEvent(eventData)}
                    </Text>
                    <Button
                      onClick={handleSubmit}
                      fontSize="16px"
                      fontWeight="bold"
                      my="6"
                      w="100%"
                      backgroundColor={buttonColour}
                      boxShadow="2xl"
                      p="6"
                      rounded="md"
                      bg="white"
                      color="white"
                    >
                      {buttonText}
                    </Button>
                    {eventJoined && (
                      <Alert mt="4" status="success">
                        <AlertIcon />
                        You have joined this event!
                      </Alert>
                    )}
                  </>
                )}
                {!eventData.isLive && eventAfterEndDate(eventData) && (
                  <Text
                    fontSize={{ base: "12px", md: "16px", lg: "24px" }}
                    fontWeight="bold"
                    textAlign="center"
                  >
                    The challenge is over
                  </Text>
                )}
                <Text textAlign="center" mt="4">
                  {startDateFormat(eventData)} - {endDateFormat(eventData)}
                </Text>
                {joinError && (
                  <Alert status="error" mt={4}>
                    {joinError}
                  </Alert>
                )}
                {eventData.isLive && userIsAuthenticated() && userHasJoined && (
                  <>
                    <HabitsCompleted
                      eventHabitCompletions={eventHabitCompletions}
                    />
                    <Button
                      onClick={toAddHabitPage}
                      fontSize="16px"
                      fontWeight="bold"
                      mt="6"
                      w="60%"
                      backgroundColor="fourth"
                      boxShadow="2xl"
                      p="6"
                      rounded="md"
                      bg="white"
                      color="white"
                    >
                      Add Habit
                    </Button>
                  </>
                )}
                <Likes
                  eventId={eventId}
                  profileData={profileData}
                  eventData={eventData}
                />
                <Comments />
              </Flex>
            </Flex>
            <Box
              width="100%"
              zIndex="-1"
              position="absolute"
              top="0"
              left="0"
              bgGradient="linear(to-b, third, second)"
              height={{ base: "650px", md: "100vh" }}
            >
              <Text opacity="30%" color="first" fontSize="400px">
                30
              </Text>
            </Box>
          </Flex>
        </>
      ) : (
        <>
          <Container>
            {hasError.error ? <p>{hasError.message}</p> : <Spinner />}
          </Container>
        </>
      )}
    </>
  );
};

export default Event;
