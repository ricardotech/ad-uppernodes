import {
  Flex,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Text,
  useBreakpointValue,
  Image as ChakraImage,
  Input,
  Icon,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import InputMask from "react-input-mask";
import React, { useEffect, useRef, useState } from "react";
import {
  RiCheckboxCircleLine,
  RiMailSendFill,
  RiSendPlaneFill,
  RiWhatsappLine,
} from "react-icons/ri";
import Header from "./components/Header";

import { FiArrowUpRight } from "react-icons/fi";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [cookies, setCookies] = useState(false);

  const [leadLabel, setLeadLabel] = useState("Enviar");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  // .replace(/[^\d]/g, "") => to transform it to int

  const [leadSent, setLeadSent] = useState(false);

  const [show, setShow] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: 0,
      height: 0,
    });

    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    useEffect(() => {
      // only execute all the code below in client side
      if (typeof window !== "undefined") {
        // Handler to call on window resize

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
      }
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }

  const size = useWindowSize();

  const isMobile = size.width < 700;

  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
    lg: true,
  });

  const toast = useToast();

  const handleContact = async () => {
    try {
      if (leadSent) {
        toast({
          status: "error",
          description: "Já recebemos o seu contato.",
        });
      } else if (!name || !phone) {
        toast({
          status: "error",
          description: "Como entraremos em contato?",
        });
      } else if (name.split(" ").length < 2) {
        toast({
          status: "error",
          description: "Por favor insira seu nome completo",
        });
      } else if (name.length < 3) {
        toast({
          status: "error",
          description: "Esse nome está certo?",
        });
      } else if (phone.length !== 18) {
        toast({
          status: "error",
          description: "Esse celular está certo?",
        });
      } else if (phone[phone.length - 1] === "_") {
        toast({
          status: "error",
          description: "Esse celular está certo?",
        });
      } else {
        setLoading(true);
        axios
          .post("https://serverless.uppernodes.com/api/lead", {
            name,
            phone,
          })
          .then((res) => {
            if (res.status === 201) {
              toast({
                description: "Entraremos em contato em breve.",
                status: "success",
              });
              setName("");
              setPhone("");
              setLeadLabel("Enviado");
              setLeadSent(true);
              setLoading(false);
            } else {
              toast({
                description: "Tente novamente mais tarde",
                status: "error",
                duration: 2000,
              });
              setLoading(false);
            }
          });
      }
    } catch (err) {
      toast({
        description: "Tente novamente mais tarde",
        status: "error",
        duration: 2000,
      });
    }
  };

  function Cookies() {
    return (
      <Flex zIndex={2} w="100vw" bottom={0} position="fixed" justify="center">
        <Flex
          zIndex={2}
          flexDir="column"
          position="fixed"
          boxShadow="rgba(0,0,0,0.1) 0 0 10px"
          w="100%"
          maxW={1000}
          mx="auto"
          bottom={0}
          bg="#FFF"
          p="6"
        >
          <Text color="#333" fontSize={isWideVersion ? "xl" : "md"}>
            By clicking “Accept All Cookies”, you agree to the storing of
            cookies on your device to enhance site navigation, analyze site
            usage, and assist in our marketing efforts
          </Text>
          <Flex mt="4">
            <Flex
              w="50%"
              cursor="pointer"
              px="6"
              py="4"
              justify="center"
              align="center"
              borderRadius="5"
              bg="#FFF"
              border="1px solid #333"
            >
              <Text color="#333" fontSize={isWideVersion ? "lg" : "sm"}>
                Cookies Settings
              </Text>
            </Flex>
            <Flex
              onClick={() =>
                setTimeout(() => {
                  setCookies(!cookies);
                }, 100)
              }
              w="50%"
              ml="4"
              cursor="pointer"
              px="6"
              py="4"
              justify="center"
              align="center"
              borderRadius="5"
              bg="#3404fb"
            >
              <Text
                color="#FFF"
                fontWeight="bold"
                fontSize={isWideVersion ? "lg" : "sm"}
              >
                Accept Cookies
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  function TopBanner() {
    return (
      <Flex
        _hover={{
          textDecorationLine: "underline",
        }}
        w="100vw"
        bg="#fafafa"
        style={{
          marginTop: 70,
          height: 60,
        }}
        p="5"
        justify="center"
        align="center"
      >
        <Text cursor="pointer" color="#333" fontSize="md">
          Já possui um site? Ganhe R$500 ou mais trazendo ele pra gente.
        </Text>
      </Flex>
    );
  }

  function AboutUs() {
    return (
      <Flex
        maxW={1000}
        flexDir={size.width > 700 ? "row" : "column"}
        w="100%"
        justify="space-between"
        align={isMobile ? "normal" : "center"}
        mx="auto"
        mt="12"
        style={{
          paddingLeft: size.width > 1000 ? 0 : 20,
          paddingRight: size.width < 1000 ? 20 : 55,
        }}
      >
        <Flex flexDir="column" maxW={size.width > 1000 ? "50vw" : "100%"}>
          <Text color="green" fontSize="lg">
            Sobre nós
          </Text>
          <Text
            color="green"
            fontSize={isMobile ? "xl" : "2xl"}
            mb="2"
            fontWeight="bold"
          >
            Somos uma agência digital desenvolvida para o mundo digital, não
            somos uma empresa, somos um veiculo.
          </Text>
        </Flex>
      </Flex>
    );
  }

  function Team() {
    return (
      <Flex
        maxW={1000}
        flexDir={size.width > 700 ? "row" : "column"}
        w="100%"
        justify="space-between"
        align={isMobile ? "normal" : "center"}
        mx="auto"
        mt="12"
        style={{
          paddingLeft: size.width > 1000 ? 0 : 20,
          paddingRight: size.width < 1000 ? 20 : 55,
        }}
      >
        <Flex flexDir="column" maxW={size.width > 700 ? "50vw" : "100%"}>
          <Text color="green" fontSize="lg">
            Nosso time é formado por
          </Text>
          <Text
            color="green"
            fontSize={isMobile ? "xl" : "2xl"}
            mb="2"
            fontWeight="bold"
          >
            Um programador, um designer e um publicitário.
          </Text>
          {isMobile && (
            <Flex>
              <ChakraImage
                borderRadius="full"
                style={{
                  height: isMobile ? 40 : 50,
                  width: isMobile ? 40 : 50,
                }}
                src="https://github.com/0xrfsd.png"
              />
              <ChakraImage
                ml="1"
                borderRadius="full"
                style={{
                  height: isMobile ? 40 : 50,
                  width: isMobile ? 40 : 50,
                }}
                src="/hosben.jpeg"
              />
              <ChakraImage
                ml="1"
                borderRadius="full"
                style={{
                  height: isMobile ? 40 : 50,
                  width: isMobile ? 40 : 50,
                }}
                src="/trinda.jpeg"
              />
            </Flex>
          )}
          <Text
            fontWeight="thin"
            mt={isMobile ? "4" : 0}
            color="green"
            fontSize="lg"
          >
            e dependendo você também pode fazer parte.
          </Text>
          <Link href="https://wa.link/ld57qz" passHref>
            <Flex
              cursor="pointer"
              mt="5"
              bg="#0b570b"
              borderRadius="5"
              justify="center"
              align="center"
              style={{
                height: 50,
                width: isMobile ? "100%" : 300,
              }}
            >
              <Text color="#FFF" fontWeight="bold">
                Quer fazer parte da equipe?
              </Text>
            </Flex>
          </Link>
        </Flex>
        <Flex
          flexDir="column"
          ml={size.width < 700 ? "0" : "10"}
          mt={size.width > 700 ? "0" : "10"}
        >
          {!isMobile && (
            <Flex>
              <ChakraImage
                borderRadius="full"
                style={{
                  height: isMobile ? 40 : 50,
                  width: isMobile ? 40 : 50,
                }}
                src="https://github.com/ricardofsdomene.png"
              />
              <ChakraImage
                ml="1"
                borderRadius="full"
                style={{
                  height: isMobile ? 40 : 50,
                  width: isMobile ? 40 : 50,
                }}
                src="/hosben.jpeg"
              />
              <ChakraImage
                ml="1"
                borderRadius="full"
                style={{
                  height: isMobile ? 40 : 50,
                  width: isMobile ? 40 : 50,
                }}
                src="/trinda.jpeg"
              />
            </Flex>
          )}
        </Flex>
      </Flex>
    );
  }

  function ToKnow() {
    return (
      <Flex
        maxW={1000}
        flexDir={size.width > 700 ? "row" : "column"}
        w="100%"
        justify="space-between"
        align={isMobile ? "normal" : "center"}
        mx="auto"
        mt="12"
        style={{
          paddingLeft: size.width > 1000 ? 0 : 20,
          paddingRight: size.width < 1000 ? 20 : 55,
        }}
      >
        <Flex flexDir="column" maxW={size.width > 1000 ? "50vw" : "100%"}>
          <Text color="#333" fontSize="lg">
            Achamos legal você saber
          </Text>
          <Text
            color="#333"
            fontSize={isMobile ? "xl" : "2xl"}
            mb="2"
            fontWeight="bold"
          >
            Ao longo de nossa jornada já foram mais de 100 empresas que ajudamos
            a alcançar seu espaço digital.
          </Text>
        </Flex>
      </Flex>
    );
  }

  type BoxProps = {
    title: string;
    content: string;
    subcontent: string;
  };

  function Box({ title, content, subcontent }: BoxProps) {
    return (
      <Flex
        style={{
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <Flex
          boxShadow="rgba(0,0,0,0.1) 0 0 10px"
          mt="12"
          flexDir="column"
          borderRadius="25"
          mx="auto"
          maxW={1000}
          bg="#F0F0F0"
          py="10"
          px="5"
          w="100%"
        >
          <Text
            color="#333"
            w="100%"
            textAlign="left"
            fontWeight="bold"
            fontSize="4xl"
          >
            {title}
          </Text>
          <Text mt="6" color="#333" w="100%" textAlign="left" fontSize="lg">
            {content}
          </Text>
          <Text mt="10" color="#333" w="100%" textAlign="left" fontSize="lg">
            {subcontent}
          </Text>
          <Flex
            mt="10"
            flexDir={isMobile ? "column" : "row"}
            justify="space-between"
            w="100%"
          >
            <Link href="https://wa.link/cg3ffk" passHref>
              <Flex
                cursor="pointer"
                style={{
                  height: 50,
                  width: isMobile ? "100%" : "49%",
                }}
                mx="auto"
                border="1px solid #dfdfdf"
                justify="space-between"
                px="5"
                align="center"
                bg="#FFF"
                borderRadius="5"
              >
                <Text color="#333" fontWeight="bold">
                  Entrar em contato
                </Text>
                <Icon ml="2" as={FiArrowUpRight} color="#333" fontSize="lg" />
              </Flex>
            </Link>
            <Link href="https://wa.link/cg3ffk" passHref>
              <Flex
                cursor="pointer"
                mt={isMobile ? "2" : 0}
                style={{
                  height: 50,
                  width: isMobile ? "100%" : "49%",
                }}
                mx="auto"
                border="1px solid #d0d0d0"
                justify="flex-start"
                px="5"
                align="center"
                bg="#eaeaea"
                borderRadius="5"
              >
                <Text color="#333" fontWeight="bold">
                  Saiba mais
                </Text>
              </Flex>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  function Solutions() {
    type SolutionProps = {
      image: string;
      title: string;
    };

    function Solution({ image, title }: SolutionProps) {
      return (
        <Flex
          onClick={() => setShow(title)}
          boxShadow="rgba(0,0,0,0.1) 0 0 10px"
          mb={isMobile ? "5" : 0}
          flexDir="column"
          borderRadius="25"
          style={{
            height: isMobile ? 370 : 400,
            width: isMobile ? "100%" : "49%",
          }}
          bg="#f0f0f0"
        >
          <ChakraImage
            onLoad={() => console.log("onLoad")}
            height={300}
            fit="cover"
            borderTopLeftRadius="25"
            borderTopRightRadius="25"
            src={image}
          />
          <Flex
            style={{
              height: isMobile ? 70 : 100,
            }}
            justify="center"
            align="center"
          >
            <Text
              color="#333"
              fontSize={isMobile ? "2xl" : "3xl"}
              fontWeight="bold"
            >
              {title}
            </Text>
          </Flex>
        </Flex>
      );
    }

    return (
      <Flex
        flexDir="column"
        w="100%"
        maxW={1000}
        mx="auto"
        mt={isMobile ? "12" : "10"}
        style={{
          paddingLeft: size.width < 1000 ? 20 : 0,
          paddingRight: size.width < 1000 ? 20 : 0,
        }}
      >
        <Flex flexDir="column" maxW={size.width > 1000 ? "50vw" : "100%"}>
          <Text color="green" fontSize="lg">
            Nossas soluções
          </Text>
          <Text
            color="green"
            fontSize={isMobile ? "xl" : "2xl"}
            mb="2"
            fontWeight="bold"
          >
            Nossas soluções são desenvolvidas sob medida, para que você consiga
            alcançar seu objetivo.
          </Text>
        </Flex>
        <Flex flexDir="column" mt="5">
          <Flex
            w="100%"
            mt="5"
            flexDir={isMobile ? "column" : "row"}
            justify="space-between"
          >
            <Solution image="/landingpage.jpeg" title="Página de venda" />
            <Solution image="/ecommerce.jpeg" title="E-commerce" />
          </Flex>
          <Flex
            w="100%"
            mt={isMobile ? 0 : "5"}
            flexDir={isMobile ? "column" : "row"}
            justify="space-between"
          >
            <Solution image="/app.png" title="Aplicativo de celular" />
            <Solution image="/identity-alt.png" title="Identidade visual" />
          </Flex>
        </Flex>
      </Flex>
    );
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
      </Head>

      <Header text />

      <Flex
        boxShadow="rgba(0,0,0,0.1) 0 0 2px"
        flexDir="column"
        bg="#FFF"
        pb="4"
        flex="1"
      >
        <Flex
          style={{
            marginTop: size.width > 700 ? 120 : 90,
            paddingLeft: 20,
            paddingRight: 20,
          }}
          justify="center"
          w="100%"
          mx="auto"
          maxW={1150}
          flexDir={size.width > 700 ? "row" : "column"}
          p={size.width < 700 ? "4" : 0}
        >
          <Flex
            flexDir="column"
            maxW={size.width > 700 ? "45%" : "100%"}
            w="100%"
            justify={size.width > 600 ? "center" : "space-around"}
            p="10"
            boxShadow="rgba(0,0,0,0.1) 0 0 10px"
            bg="#F0F0F0"
            borderRadius="25"
          >
            <Text fontSize="xl" maxW={600} color="#333">
              Conecte com a gente.
            </Text>
            <Text fontSize="xl" maxW={600} color="#333">
              Queremos saber mais
            </Text>
            <Flex mb="4">
              <Text fontSize="xl" maxW={600} color="#333">
                como ajudar
              </Text>
              <Text
                ml="1.5"
                fontSize="xl"
                maxW={600}
                fontWeight="bold"
                color="#333"
              >
                você!
              </Text>
            </Flex>
            <Text m="1" fontSize="md" maxW={600} color="#333">
              Nome
            </Text>
            <Input
              style={{
                borderRadius: 5,
                padding: 10,
                color: "#777",
                height: 50,
                border: "1px solid #e0e0e0",
              }}
              bg="#FFF"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
            <Text
              style={{
                marginTop: 10,
              }}
              m="1"
              fontSize="md"
              maxW={600}
              color="#333"
            >
              Celular
            </Text>
            <InputMask
              style={{
                borderRadius: 5,
                padding: 10,
                color: "#777",
                height: 50,
                border: "1px solid #e0e0e0",
              }}
              mask="+55 (99) 999999999"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
            />
            <Button
              disabled={leadSent}
              mt="4"
              onClick={handleContact}
              cursor="pointer"
              style={{
                marginTop: 30,
                height: 50,
                width: "100%",
              }}
              borderRadius="5"
              justifyContent="center"
              alignItems="center"
              bg="#3404fb"
            >
              {loading ? (
                <Spinner color="#EEE" size="sm" />
              ) : (
                <Flex align="center">
                  <Text color="#FFF" fontWeight="semibold">
                    {leadLabel}
                  </Text>
                  {leadLabel === "Enviado" && (
                    <Icon
                      as={RiCheckboxCircleLine}
                      fontSize="md"
                      color="#EEE"
                      ml="1"
                    />
                  )}
                </Flex>
              )}
            </Button>
          </Flex>
          <Flex
            flexDir="column"
            justify="space-between"
            style={{
              paddingLeft: size.width > 700 ? 20 : 0,
              paddingTop: size.width < 700 ? 20 : 0,
            }}
          >
            <Flex flexDir="column">
              <Flex>
                <Text fontSize={size.width < 700 ? "3xl" : "4xl"} color="#333">
                  Soluções que fazem a diferença.
                </Text>
              </Flex>
              <Text
                fontSize={size.width < 700 ? "md" : "lg"}
                color="#333"
                fontWeight="light"
              >
                Para você e para seu público.
              </Text>
            </Flex>
            <Flex>
              <Flex flexDir="column">
                <ChakraImage
                  zIndex={2}
                  mt="4"
                  borderRadius="12"
                  height={140}
                  maxW={140}
                  src="/u0.png"
                />
                <ChakraImage
                  zIndex={1}
                  mt="4"
                  borderRadius="12"
                  height={140}
                  maxW={140}
                  src="/u1.png"
                />
              </Flex>
              <Flex flexDir="column" ml="4">
                <ChakraImage
                  zIndex={2}
                  borderRadius="12"
                  mt="4"
                  height={140}
                  maxW={140}
                  src="/u2.jpeg"
                />
                <ChakraImage
                  zIndex={1}
                  borderRadius="12"
                  mt="4"
                  height={140}
                  maxW={140}
                  src="/u3.png"
                />
              </Flex>
              {(size.width > 500 || size.width > 1000) && (
                <Flex flexDir="column" ml="4">
                  <ChakraImage
                    zIndex={2}
                    borderRadius="12"
                    mt="4"
                    height={140}
                    maxW={140}
                    src="/u4.png"
                  />
                  <ChakraImage
                    zIndex={1}
                    borderRadius="12"
                    mt="4"
                    height={140}
                    maxW={140}
                    src="/u5.png"
                  />
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>

        <Solutions />
        <AboutUs />
        <Box
          title="Páginas de venda"
          content="A página de venda ou mais conhecida como landing page têm o objetivo de sempre levar o usuário a executar uma conversão, seja cadastro em um formulário, download de um e-book ou até mesmo a compra direta de um produto ou serviço da empresa."
          subcontent="Nós desenvolvemos landing pages para os mais diferentes ramos de atividade, e o ponto em comum em todas as empresas que aderiram a utilização das landing pages foi o aumento na captação de leads e na conversão em venda real, aumentando a receita e visibilidade das campanhas."
        />
        {/* <Box
          title="E-commerces"
          content="-"
          subcontent="-"
        />
        <Box
          title="Aplicativos de celular"
          content="-"
          subcontent="-"
        />
        <Box
          title="Identidades visuais"
          content="-"
          subcontent="-"
        /> */}
        {/* <ToKnow /> */}
        {/* <Box title="" content="." subcontent="." /> */}
        <Team />
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody></DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {cookies && <Cookies />}
    </>
  );
};

export default Home;
