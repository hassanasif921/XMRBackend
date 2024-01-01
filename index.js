const express = require('express');
const axios = require('axios');
const { ethers } = require("ethers");
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1/invoice';
const API_KEY = 'BQF8W4X-3TYMHPC-GSDV6NF-QAZE93A'; // Replace with your actual API key
const privateKey = '603594a126121e45893dfd11aff29fcd21f9f5245618ed7ac27bc8418a42da13'; // Replace with your private key
const contractAddress = '0x39303E59dEFC5957891fEaeD0968529C456dd188'; // Replace with the contract address
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			}
		],
		"name": "EndPresale",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getStage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "ref",
				"type": "address"
			}
		],
		"name": "PurchaseWithETH",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "ref",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"name": "PurchaseWithETHCreditcard",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "ref",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "usdtAmount",
				"type": "uint256"
			}
		],
		"name": "PurchaseWithUSDT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawLeftover",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "BSCUSD",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLatestPriceETH",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "walletAddress",
				"type": "address"
			}
		],
		"name": "getPurchaseInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "stage",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "claimed",
						"type": "bool"
					}
				],
				"internalType": "struct presale.Purchase[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isClaimable",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isPresaleOpen",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastStagetime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "priceperusd",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "purchases",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "stage",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "claimed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "referralBalances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stage",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "STAGE_DURATION",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stages",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenAmountPerStage",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tokenlimit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenSold",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "XMR",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; 
const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");

// Create a wallet instance
const wallet = new ethers.Wallet(privateKey, provider);

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);
const options = {
    gasPrice: ethers.utils.parseUnits('10', 'gwei'), // Replace '10' with the gas price in gwei you want to use
    // You can also specify gasLimit here if necessary
};
app.get('/getAmount', async (req, res) => {
  try {
    // Get the amount from the query parameters
    //0x0000000000000000000000000000000000000000 zero address
    const amount = req.query.amount;
    const amountinWEi = parseFloat(amount) * 1000000000000000000;
    const refferaladd = req.query.refferaladd;
    const buyer = req.query.buyer;
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required.' });
    }

    // Make a request to the NowPayments API
    const nowPaymentsResponse = await axios.post(
      NOWPAYMENTS_API_URL,
      {
        price_amount: parseFloat(amount),
        price_currency: 'usd',
        order_id: '', // You may generate a dynamic order ID
        order_description: '',
        ipn_callback_url: 'https://nowpayments.io',
        success_url: `http://localhost:3000/paymentCallback?refferaladd=${refferaladd}&amount=${amountinWEi}&buyer=${buyer}`,
        cancel_url: 'https://nowpayments.io',
      },
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    // Return the response from the NowPayments API to the client
    res.json(nowPaymentsResponse.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/paymentCallback/', async (req, res) => {
    try {
      const invoiceKey = req.query.NP_id;
      const refferaladd = req.query.refferaladd;
      const amount = req.query.amount;
      const buyer = req.query.buyer;

      // Fetch payment details using the provided invoice key
      const nowPaymentsResponse = await axios.get(
        `${'https://api.nowpayments.io/v1/payment'}/${invoiceKey}`,
        {
          headers: {
            'x-api-key': API_KEY,
          },
        }
      );
  
      const paymentStatus = nowPaymentsResponse.data.payment_status;
        console.log(nowPaymentsResponse.data)
      // Check if payment_status is "finished"
      if (paymentStatus === 'finished') {
        // Payment is finished, send a response
        const tx = await contract.PurchaseWithETHCreditcard(refferaladd,amount,buyer, options);
        console.log('Transaction hash:', tx.hash);

        // Wait for the transaction to be mined
        await tx.wait();
        console.log('Transaction confirmed');
        res.json({ status: 'Payment is finished.' });
      } else {
        // Payment is not finished, you can handle other statuses as needed
        res.json({ status: 'Payment is not finished.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
