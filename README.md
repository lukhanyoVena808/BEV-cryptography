# Cryptography
## Building an Evoting System using Blockchain

The COVID19 pandemic has reignited a debate about the use of e-voting systems
with detractors citing security concerns as the primary reason why they are against
these systems. With the rapid development of technology however, it is possible
that in the near future public perceptions around e-voting will inevitably change. A
blockchain is a growing list of records which are linked using cryptography. Each
block contains a cryptographic hash of the previous block, a timestamp, and
transaction data. Blockchain has gained increasing popularity in recent years as a
result of being a keystone of the popular cryptocurrencies. The fact that this
technology is decentralized and secure also makes it a perfect candidate for e-voting
applications. 
## 
In this project, a stand-alone proof of concept blockchain evoting
system is delivered. The system provides a decentralised architecture to run and support
a voting scheme that is open, fair, and independently verifiable. 

Requirements:

- [Truffle Ganache](https://trufflesuite.com/ganache/)
- [Node JS](https://nodejs.org/en/download)
- [MailTrap](https://mailtrap.io/signin)

CSS and HTML of the system was adapted from: [Repo](https://github.com/dhruti-patel/BlockVote-Truffle)

## Steps to run project ([inside this directory](./Code/)):

<br>
To install truffle:

```
npm install truffle -g
```

<br>
To install required packages and / modules:

```
npm install
```
<br>
To deploy smart contact (must be done while Truffle Ganache is opened):

```
npx truffle migrate 
```
<br>
To run the web app:

 ```
 npm run dev
 ```