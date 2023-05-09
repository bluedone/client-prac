import React, { useState, useEffect } from 'react';
import { AppBar, IconButton, Button, Container, Grid, Box, TextField, LinearProgress, Typography, linearProgressClasses, CircularProgress } from '@mui/material';
import { orange } from '@mui/material/colors';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import './style.scss';


export const providerOptions = {
    coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
            appName: "Web 3 Modal Demo",
            infuraId: process.env.INFURA_KEY
        }
    },
    walletconnect: {
        package: WalletConnect,
        options: {
            infuraId: process.env.INFURA_KEY
        }
    }
};
const web3Modal = new Web3Modal({
    providerOptions // required
});
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
});

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 20,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));


const displayTime = () => {
    let now = new Date();
    let years = now.getFullYear();
    let months = now.getMonth() + 1;
    let days = now.getDay();
    let dateString = years + '/' + months + '/' + days;
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let timeString = hours + ':' + minutes + ':' + seconds;
    document.getElementById("date").innerHTML = dateString;
    document.getElementById("time").innerHTML = timeString;
};
const icostate = ['Deposit', 'Withdraw', 'Claim'];
const CircularProgressWithLabel = (props) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" size={100}
                sx={{
                    color: orange[200],
                    position: 'absolute',
                    top: -50,
                    left: -50
                }} {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                }}
            >
                <Typography variant="h4" component="div" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}
CircularProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired
}
const Initialco = () => {

    const [softCap, setsoftCap] = useState(100);
    const [hardCap, sethardCap] = useState(1000);
    const [amount, setamount] = useState(10);
    const [bstate, setbstate] = useState(icostate[0]);
    const [spent, setspent] = useState(20);
    const [ainput, setainput] = useState(0); const [provider, setProvider] = useState();
    const [library, setLibrary] = useState();
    const [account, setAccount] = useState();
    const [network, setNetwork] = useState();
    const [Accounts, setAccounts] = useState();
    const [ChainId, setChainId] = useState();


    useEffect(() => {
        const timer = setInterval(() => {
            setspent((prevProgress) =>
                prevProgress >= 100 ? 10 : prevProgress + 1 / 864
            );
            displayTime();
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);
    useEffect(() => {
        if (provider?.on) {
            const handleAccountsChanged = (accounts) => {
                setAccounts(accounts);
            };

            const handleChainChanged = (chainId) => {
                setChainId(chainId);
            };

            const handleDisconnect = () => {
                disconnect();
            };

            provider.on("accountsChanged", handleAccountsChanged);
            provider.on("chainChanged", handleChainChanged);
            provider.on("disconnect", handleDisconnect);

            return () => {
                if (provider.removeListener) {
                    provider.removeListener("accountsChanged", handleAccountsChanged);
                    provider.removeListener("chainChanged", handleChainChanged);
                    provider.removeListener("disconnect", handleDisconnect);
                }
            };
        }
    }, [provider]);
    const connectWallet = async () => {
        try {
            const provider = await web3Modal.connect();
            const library = new ethers.providers.Web3Provider(provider);
            const accounts = await library.listAccounts();
            const network = await library.getNetwork();
            setProvider(provider);
            setLibrary(library);
            if (accounts) setAccount(accounts[0]);
            setNetwork(network);
        } catch (error) {
            console.error(error);
        }
    };
    const refreshState = () => {
        setAccount();
        setChainId();
    };

    const disconnect = async () => {
        await web3Modal.clearCachedProvider();
        refreshState();
    };
    // const switchNetwork = async () => {
    //     try {
    //         await library.provider.request({
    //             method: "wallet_switchEthereumChain",
    //             params: [{ chainId: toHex(137) }],
    //         });
    //     } catch (switchError) {
    //         // This error code indicates that the chain has not been added to MetaMask.
    //         if (switchError.code === 4902) {
    //             try {
    //                 await library.provider.request({
    //                     method: "wallet_addEthereumChain",
    //                     params: [
    //                         {
    //                             chainId: toHex(137),
    //                             chainName: "Polygon",
    //                             rpcUrls: ["https://polygon-rpc.com/"],
    //                             blockExplorerUrls: ["https://polygonscan.com/"],
    //                         },
    //                     ],
    //                 });
    //             } catch (addError) {
    //                 throw addError;
    //             }
    //         }
    //     }
    // };
    // const connectWalletHandler = async () => {
    //     const { ethereum } = window;
    //     if (!ethereum) {
    //         alert("Please install Metamask!")
    //     }
    //     try {
    //         const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    //         console.log("Found an account! Address: ", accounts[0]);
    //         setCurrentAccount(accounts[0]);
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }
    // const checkWalletConnected = () => {
    //     const { ethereum } = window;
    //     if (!ethereum) {
    //         console.log("Make sure you have Metamask installed");
    //         return;
    //     } else {
    //         console.log("Wallet exists! We're ready to go");
    //     }
    // }
    const Deposite = () => {
        const newValue = amount + ainput;
        setamount(newValue);
    }
    const onChange = (event) => {
        const newValue = event.target.value * 1;
        setainput(newValue);
    }
    return (
        <div>
            <Grid container>
                <Grid xs={12}>
                    <AppBar position="static" color="inherit" className='header' title="Smart Contract">Smart Contract
                    </AppBar>
                </Grid>
                <Grid xs={7}>
                    <span id='date'></span>
                    <span id='time'></span>
                </Grid>
                <Grid xs={5}>
                    <Button secondary color="success" id="connect-button" onClick={connectWallet} > <AddShoppingCartIcon />  Wallet Connect</Button>
                </Grid>
            </Grid>
            <Container >
                <Box sx={{
                    border: '1px solid gray',
                    boxShadow: ' 10px 10px 10px #fff, 10px 10px 0 gray',
                    borderRadius: '5px',
                    paddingTop: "3%",
                    paddingBottom: '5%',
                    marginTop: "5%"

                }}>
                    <Grid container >
                        <Grid xs={3}>
                            <div style={{ padding: '5%' }}>
                                <TextField
                                    id="outlined-number"
                                    label="Deposited Amount Number"
                                    type="number"
                                    color="info"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(event) => onChange(event)}
                                /></div>
                        </Grid>
                        <Grid xs={2}>
                            <div className='description'>total amount: {<span style={{ fontWeight: 700, fontSize: '18pt' }}>{amount}</span>}</div>
                        </Grid>
                        <Grid xs={5}></Grid>
                        <Grid xs={2}>
                            <div style={{ padding: "10%" }}><Button variant="outlined" onClick={Deposite}>{bstate}</Button></div>
                        </Grid>
                        <Grid xs={1}>
                            <p style={{ fontSize: '18pt' }}>0</p>
                        </Grid>
                        <Grid xs={10} style={{ paddingTop: '1%' }}>
                            <BorderLinearProgress variant="determinate" value={softCap / 10} />
                            <Typography variant="h3" component="div" si color="green">
                                {`${Math.round((softCap / hardCap) * 100)}%`}
                            </Typography>
                        </Grid>
                        <Grid xs={1}>
                            <p style={{ fontSize: '18pt' }}>{hardCap}</p>
                        </Grid>
                        <Grid xs={2}></Grid>
                        <Grid xs={1} style={{ paddingTop: '1%' }} rowSpacing={8}>
                            <CircularProgressWithLabel value={spent} />
                        </Grid>
                        <Grid xs={7}>
                            <span style={{ fontSize: "18pt", }}>ICO period: 5/8/2023 0 AM GMT - 5/9/2023 0 AM GMT</span>
                        </Grid>
                    </Grid>


                </Box>
            </Container>
        </div >


    )

}
export default Initialco;