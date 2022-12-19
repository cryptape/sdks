const {ethers} = require("hardhat");
const {getTxReceipt} = require("../rpc/utils/tx");
const {expect} = require("chai");
// FailedTxContract
//  enum ModDataStyle{
//         NORMAL,          //0: mod int int[] string map  data
//         CROSS_NORMAL,    //1: mod cross contract's int int[] string map data
//         BRIDGE_TRANSFER, //2: mod proxy ckb token data
//         SELF_DESTRUCT,   //3: self destruct
//         CREATE2,         //4: deploy new contract use create2
//         DELEGATE_CALL,   //5: delegate call mod self int int[] string map data
//         CLS_DESTRUCT     //6: mod other contract data use cross call
//     }
//     https://blog.soliditylang.org/2020/12/16/solidity-v0.8.0-release-announcement/
//     notice : only support > 0.8.0
//     enum FailedStyle{
//         NO,         // 0: normal tx
//         REQUIRE_1,  // 1: failed for require(false)
//         ASSERT01,   // 2: 0x01: assert false
//         ASSERT11,   // 3: 0x11: If an arithmetic operation results in underflow or overflow
//         ASSERT12,   // 4: 0x12: divide or divide modulo by zero
//         ASSERT21,   // 5: 0x21: If you convert a value that is too big or negative into an enum type.
//         ASSERT22,   // 6: 0x22: If you access a storage byte array that is incorrectly encoded.
//         ASSERT31,   // 7: 0x31: If you call .pop() on an empty array.
//         ASSERT32,   // 8: 0x32: If you access an array, bytesN or an array slice at an out-of-bounds or negative index (i.e. x[i] where i >= x.length or i < 0).
//         ASSERT41,   // 9: 0x41: If you allocate too much memory or create an array that is too large.
//         ASSERT51,   // 10: todo:0x51: If you call a zero-initialized variable of internal function type.
//         Error1,     // 11: error
//     }
describe("Failed commit tx", function () {
    this.timeout(10000000)
    let failedContract070;
    let failedContract080;
    before(async function () {
        failedContract070 = await prepareFailedTxContract("contracts/failedTx/failedTxContract0.7.0.sol:FailedTxContract")
        failedContract080 = await prepareFailedTxContract("contracts/failedTx/failedTxContract.0.8.4.sol:FailedTxContract")

    });

    it("normal tx will change the world(0.7.0)", async () => {
        let response1 = await invoke_before_test_after(failedContract070, [0, 1, 2, 4, 5], 0, false, true, 2)
        for (let i = 0; i < response1.afterModArray.length; i++) {
            expect(response1.afterModArray[i]).to.be.not.equal(response1.beforeModArray[i])
        }

    })

    it("normal tx will change the world(0.8.0)", async () => {
        let response1 = await invoke_before_test_after(failedContract080, [0, 1, 2, 4, 5], 0, false, true, 2)
        for (let i = 0; i < response1.afterModArray.length; i++) {
            expect(response1.afterModArray[i]).to.be.not.equal(response1.beforeModArray[i])
        }

    })

    it("deploy the contract without the payable construct method" , async () => {
        let txHash = await ethers.provider.send("eth_sendTransaction", [{
            "gas": "0x2fa000",
            "value": "0x11",
            "data": "0x608060405234801561001057600080fd5b50610cc5806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806320039f1f14610051578063806b3bc914610081578063a31eddf4146100b1578063a6d6ff4c146100e1575b600080fd5b61006b60048036038101906100669190610763565b610111565b6040516100789190610a30565b60405180910390f35b61009b60048036038101906100969190610624565b6101ce565b6040516100a891906109e5565b60405180910390f35b6100cb60048036038101906100c691906106a3565b610337565b6040516100d891906109e5565b60405180910390f35b6100fb60048036038101906100f69190610624565b6103a6565b60405161010891906109e5565b60405180910390f35b600080607b905060006002848360405160200161012f929190610953565b60405160208183030381529060405260405161014b919061093c565b602060405180830381855afa158015610168573d6000803e3d6000fd5b5050506040513d601f19601f8201168201806040525081019061018b919061073a565b90507f206c99af80077bd66fda00313ef6a84748262ff79fed184db845e6d9e0f0b607816040516101bc9190610a30565b60405180910390a18092505050919050565b60007fd062abfcb02dc166d9c06a70c6044c60a13ba31dd286f60e5b97e66ec9417e6284846040516102019291906109b5565b60405180910390a1600060608573ffffffffffffffffffffffffffffffffffffffff1685604051610232919061093c565b6000604051808303816000865af19150503d806000811461026f576040519150601f19603f3d011682016040523d82523d6000602084013e610274565b606091505b50915091507f55c40295a06df6d08f98e75808b8364f546dc7217f1dc12c5611fb676d63635382826040516102aa929190610a00565b60405180910390a1838051906020012081805190602001201461032a57606081856040516020016102dc92919061097b565b6040516020818303038152906040529050806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103219190610a6d565b60405180910390fd5b6001925050509392505050565b600080600090505b845181101561039a5761038c85828151811061035757fe5b602002602001015185838151811061036b57fe5b602002602001015185848151811061037f57fe5b60200260200101516101ce565b50808060010191505061033f565b50600190509392505050565b60008060608573ffffffffffffffffffffffffffffffffffffffff16856040516103d0919061093c565b6000604051808303816000865af19150503d806000811461040d576040519150601f19603f3d011682016040523d82523d6000602084013e610412565b606091505b50915091507fb58566e6210f411973b0f957e0f1582860e35f22636c98faf436de09f6b38177816040516104469190610a4b565b60405180910390a16001925050509392505050565b60008135905061046a81610c61565b92915050565b600082601f83011261048157600080fd5b813561049461048f82610abc565b610a8f565b915081818352602084019350602081019050838560208402820111156104b957600080fd5b60005b838110156104e957816104cf888261045b565b8452602084019350602083019250506001810190506104bc565b5050505092915050565b600082601f83011261050457600080fd5b813561051761051282610ae4565b610a8f565b9150818183526020840193506020810190508360005b8381101561055d5781358601610543888261057c565b84526020840193506020830192505060018101905061052d565b5050505092915050565b60008151905061057681610c78565b92915050565b600082601f83011261058d57600080fd5b81356105a061059b82610b0c565b610a8f565b915080825260208301602083018583830111156105bc57600080fd5b6105c7838284610c04565b50505092915050565b600082601f8301126105e157600080fd5b81356105f46105ef82610b38565b610a8f565b9150808252602083016020830185838301111561061057600080fd5b61061b838284610c04565b50505092915050565b60008060006060848603121561063957600080fd5b60006106478682870161045b565b935050602084013567ffffffffffffffff81111561066457600080fd5b6106708682870161057c565b925050604084013567ffffffffffffffff81111561068d57600080fd5b6106998682870161057c565b9150509250925092565b6000806000606084860312156106b857600080fd5b600084013567ffffffffffffffff8111156106d257600080fd5b6106de86828701610470565b935050602084013567ffffffffffffffff8111156106fb57600080fd5b610707868287016104f3565b925050604084013567ffffffffffffffff81111561072457600080fd5b610730868287016104f3565b9150509250925092565b60006020828403121561074c57600080fd5b600061075a84828501610567565b91505092915050565b60006020828403121561077557600080fd5b600082013567ffffffffffffffff81111561078f57600080fd5b61079b848285016105d0565b91505092915050565b6107ad81610bb2565b82525050565b6107bc81610bc4565b82525050565b6107cb81610bd0565b82525050565b60006107dc82610b64565b6107e68185610b7a565b93506107f6818560208601610c13565b6107ff81610c50565b840191505092915050565b600061081582610b64565b61081f8185610b8b565b935061082f818560208601610c13565b80840191505092915050565b600061084682610b6f565b6108508185610b96565b9350610860818560208601610c13565b61086981610c50565b840191505092915050565b600061087f82610b6f565b6108898185610ba7565b9350610899818560208601610c13565b80840191505092915050565b60006108b2600c83610ba7565b91507f65786563206661696c64203a00000000000000000000000000000000000000006000830152600c82019050919050565b60006108f2600383610ba7565b91507f23232300000000000000000000000000000000000000000000000000000000006000830152600382019050919050565b61093661093182610bfa565b610c46565b82525050565b6000610948828461080a565b915081905092915050565b600061095f8285610874565b915061096b8284610925565b6020820191508190509392505050565b6000610986826108a5565b9150610992828561080a565b915061099d826108e5565b91506109a9828461080a565b91508190509392505050565b60006040820190506109ca60008301856107a4565b81810360208301526109dc81846107d1565b90509392505050565b60006020820190506109fa60008301846107b3565b92915050565b6000604082019050610a1560008301856107b3565b8181036020830152610a2781846107d1565b90509392505050565b6000602082019050610a4560008301846107c2565b92915050565b60006020820190508181036000830152610a6581846107d1565b905092915050565b60006020820190508181036000830152610a87818461083b565b905092915050565b6000604051905081810181811067ffffffffffffffff82111715610ab257600080fd5b8060405250919050565b600067ffffffffffffffff821115610ad357600080fd5b602082029050602081019050919050565b600067ffffffffffffffff821115610afb57600080fd5b602082029050602081019050919050565b600067ffffffffffffffff821115610b2357600080fd5b601f19601f8301169050602081019050919050565b600067ffffffffffffffff821115610b4f57600080fd5b601f19601f8301169050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b600082825260208201905092915050565b600081905092915050565b6000610bbd82610bda565b9050919050565b60008115159050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015610c31578082015181840152602081019050610c16565b83811115610c40576000848401525b50505050565b6000819050919050565b6000601f19601f8301169050919050565b610c6a81610bb2565b8114610c7557600080fd5b50565b610c8181610bd0565b8114610c8c57600080fd5b5056fea2646970667358221220203db93b05c0eb2a631d08893702c2d7c6cd5b48aa97633b506b71dfabf2881b64736f6c634300060c0033"
        }]);
        await checkResponseOfFailedTx(txHash, false)
    })
    describe("failed tx does not change the world", function () {

        it("1. ModDataStyle.NORMAL 2.FailedStyle.ASSERT01", async () => {
            let response = await invoke_before_test_after(failedContract070, [0], 2, true, true)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })
        it("1.ModDataStyle.NORMAL, ModDataStyle.CROSS_NORMAL 2.FailedStyle.ASSERT01", async () => {
            let response = await invoke_before_test_after(failedContract070, [0, 1], 2, true, true)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("1. ModDataStyle.NORMAL, ModDataStyle.CROSS_NORMAL ModDataStyle.BRIDGE_TRANSFER 2.FailedStyle.ASSERT01", async () => {
            let response = await invoke_before_test_after(failedContract070, [0, 1, 2], 2, true, true)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        // it("自毁合约", async () => {
        //     //no
        //     // let response = await invoke_before_test_after(contract,[0,1,2],2,true,true)
        //     // expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        // })

        it("1. ModDataStyle.NORMAL, ModDataStyle.CROSS_NORMAL ModDataStyle.BRIDGE_TRANSFER,ModDataStyle.CREATE2 ModDataStyle. 2.FailedStyle.ASSERT01", async () => {
            let response = await invoke_before_test_after(failedContract070, [0, 1, 2, 4], 2, true, true)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("1. ModDataStyle.NORMAL, ModDataStyle.CROSS_NORMAL ModDataStyle.BRIDGE_TRANSFER,ModDataStyle.CREATE2,ModDataStyle.DELEGATE_CALL 2.FailedStyle.ASSERT01", async () => {
            let response = await invoke_before_test_after(failedContract070, [0, 1, 2, 4, 5], 2, true, true)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())

        })

        it("1. ModDataStyle.NORMAL, ModDataStyle.CROSS_NORMAL ModDataStyle.BRIDGE_TRANSFER,ModDataStyle.CREATE2,ModDataStyle.DELEGATE_CALL,ModDataStyle.CLS_DESTRUCT 2.FailedStyle.ASSERT01", async () => {
            let response = await invoke_before_test_after(failedContract070, [0, 1, 2, 4, 5, 6], 2, true, true)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })
    })
    describe("bridge token failed tx", function () {

        let ckbProxyContract;
        let failedTransferContract;
        before(async function () {
            console.log("deploy proxy ckb contractAddress")
            // deploy ckb proxy contract
            let ckbAddress = await deployCkbProxyContact()
            ckbProxyContract = await ethers.getContractAt("contracts/failedTx/failedTxContract.0.8.4.sol:EIP20Interface", ckbAddress);
            // deploy failedTransferContractInfo contract
            let failedTransferContractInfo = await ethers.getContractFactory("failedTransferContract")
            failedTransferContract = await failedTransferContractInfo.deploy()
            await failedTransferContract.deployed()
        })
        it("transfer failed", async () => {
            // transfer balance > self balance
            let balance = await ethers.provider.getBalance(ethers.provider.getSigner(0).getAddress())
            let beforeTransferProxyCkbBalance = await ethers.provider.getBalance(ckbProxyContract.address)
            let tx = await ckbProxyContract.transfer(ckbProxyContract.address, balance,{ gasLimit: 1000000})
            await checkResponseOfFailedTx(tx.hash, false)

            // check balance not mod
            let afterTransferProxyCkbBalance = await ethers.provider.getBalance(ckbProxyContract.address)
            expect(beforeTransferProxyCkbBalance).to.be.equal(afterTransferProxyCkbBalance)
        })

        it("transfer success ,exec other failed", async () => {
            let beforeTransferProxyCkbBalance = await ethers.provider.getBalance(ckbProxyContract.address)
            let tx = await failedTransferContract.transfer_success_other_failed(ckbProxyContract.address, {
                value: "0xffff",
                gasLimit: 1000000
            })
            await checkResponseOfFailedTx(tx.hash, false)
            // check balance not mod
            let afterTransferProxyCkbBalance = await ethers.provider.getBalance(ckbProxyContract.address)
            expect(beforeTransferProxyCkbBalance).to.be.equal(afterTransferProxyCkbBalance)

        })
    })

    describe("Revert", function () {
        it("require", async () => {
            console.log("deploy contains require method contract")
            let contractInfo = await ethers.getContractFactory("contracts/failedTx/failedTxContract.0.8.4.sol:FailedTxContract");
            let contract = await contractInfo.deploy()
            await contract.deployed()
            console.log("invoke require method ")
            await invoke_before_test_after(contract, [0], 1, true, false)
        })

        it("out of gas tx(max cycles exceeded) (https://github.com/RetricSu/godwoken-kicker/issues/279)",async ()=>{
            let eventTestContractInfo = await ethers.getContractFactory("eventTestContract");
            contract = await eventTestContractInfo.deploy()
            await contract.deployed()
            let tx = await contract.testEvent(2,7,1,17500,{gasLimit:"0x989680"})
            let response = await getTxReceipt(ethers.provider,tx.hash,10)
            expect(response.status).to.be.equal(0)
        }).timeout(100000)

        it("out of gas(handle message failed)",async ()=>{
            let eventTestContractInfo = await ethers.getContractFactory("eventTestContract");
            let contract = await eventTestContractInfo.deploy()
            await contract.deployed()
            let tx = await contract.testLog(300000,{gasLimit:"0x989680"})
            let response = await getTxReceipt(ethers.provider, tx.hash, 100)
            expect(response.status).to.be.equal(0)
        }).timeout(60000)
    })

    describe("Assert(0.8.0)", function () {
        //Revert on assertion failures and similar conditions instead of using the invalid opcode.


        it("Revert 0x01", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1, 2, 4, 5, 6], 2, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("Revert 0x11", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1, 2, 4, 5, 6], 3, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("Revert 0x12", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1, 2, 4, 5, 6], 4, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("Revert 0x21", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1, 2, 4, 5, 6], 5, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())

        })

        it("Revert 0x22", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1, 2, 4, 5, 6], 6, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())

        })

        it("Revert 0x31", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1, 2, 4, 5, 6], 7, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("Revert 0x32", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1, 2, 4, 5, 6], 8, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("Revert 0x41", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1, 2, 4, 5, 6], 9, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("Revert 0x51", async () => {
            //todo
            let response = await invoke_before_test_after(failedContract080, [0, 1, 2, 4, 5, 6], 10, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })
    })


})


async function checkResponseOfFailedTx(txHash, isLow080Panic) {
    // check status = 0
    console.log("--------------checkResponseOfFailedTx--------------")
    let txReceipt = await getTxReceipt(ethers.provider, txHash, 100)
    expect(txReceipt.status).to.be.equal(0);
    let txInfo = await ethers.provider.getTransaction(txHash)
    console.log("txInfo:", txInfo)
    //check nonce +1
    let nonce = await ethers.provider.getTransactionCount(txInfo.from)
    expect(nonce - txInfo.nonce).to.be.equal(1)
    if (isLow080Panic) {
        // gasLimit == gasUsed
        expect(txInfo.gasLimit.toString()).to.be.equal(txReceipt.gasUsed.toString())
        return
    }
    // gasUsed > gasLimit
    expect(txInfo.gasLimit - txReceipt.gasUsed >= 0).to.be.equal(true)
}

async function deployCkbProxyContact() {
    let txHash = await ethers.provider.send("eth_sendTransaction", [{
        "data": "0x60806040523480156200001157600080fd5b5060405162001928380380620019288339818101604052810190620000379190620001f9565b84600390805190602001906200004f9291906200009d565b508360049080519060200190620000689291906200009d565b50826001819055508160028190555080600560006101000a81548160ff021916908360ff16021790555050505050506200048e565b828054620000ab906200036b565b90600052602060002090601f016020900481019282620000cf57600085556200011b565b82601f10620000ea57805160ff19168380011785556200011b565b828001600101855582156200011b579182015b828111156200011a578251825591602001919060010190620000fd565b5b5090506200012a91906200012e565b5090565b5b80821115620001495760008160009055506001016200012f565b5090565b6000620001646200015e84620002e8565b620002bf565b9050828152602081018484840111156200018357620001826200043a565b5b6200019084828562000335565b509392505050565b600082601f830112620001b057620001af62000435565b5b8151620001c28482602086016200014d565b91505092915050565b600081519050620001dc816200045a565b92915050565b600081519050620001f38162000474565b92915050565b600080600080600060a0868803121562000218576200021762000444565b5b600086015167ffffffffffffffff8111156200023957620002386200043f565b5b620002478882890162000198565b955050602086015167ffffffffffffffff8111156200026b576200026a6200043f565b5b620002798882890162000198565b94505060406200028c88828901620001cb565b93505060606200029f88828901620001cb565b9250506080620002b288828901620001e2565b9150509295509295909350565b6000620002cb620002de565b9050620002d98282620003a1565b919050565b6000604051905090565b600067ffffffffffffffff82111562000306576200030562000406565b5b620003118262000449565b9050602081019050919050565b6000819050919050565b600060ff82169050919050565b60005b838110156200035557808201518184015260208101905062000338565b8381111562000365576000848401525b50505050565b600060028204905060018216806200038457607f821691505b602082108114156200039b576200039a620003d7565b5b50919050565b620003ac8262000449565b810181811067ffffffffffffffff82111715620003ce57620003cd62000406565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b62000465816200031e565b81146200047157600080fd5b50565b6200047f8162000328565b81146200048b57600080fd5b50565b61148a806200049e6000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c806370a082311161007157806370a08231146101a357806395d89b41146101d35780639f8dfb59146101f1578063a457c2d71461020f578063a9059cbb1461023f578063dd62ed3e1461026f576100b4565b806306fdde03146100b9578063095ea7b3146100d757806318160ddd1461010757806323b872dd14610125578063313ce567146101555780633950935114610173575b600080fd5b6100c161029f565b6040516100ce9190610f31565b60405180910390f35b6100f160048036038101906100ec9190610d9e565b610331565b6040516100fe9190610f16565b60405180910390f35b61010f61034f565b60405161011c9190611013565b60405180910390f35b61013f600480360381019061013a9190610d4b565b6103b8565b60405161014c9190610f16565b60405180910390f35b61015d6104b8565b60405161016a919061102e565b60405180910390f35b61018d60048036038101906101889190610d9e565b6104cf565b60405161019a9190610f16565b60405180910390f35b6101bd60048036038101906101b89190610cde565b61057a565b6040516101ca9190611013565b60405180910390f35b6101db610619565b6040516101e89190610f31565b60405180910390f35b6101f96106ab565b6040516102069190611013565b60405180910390f35b61022960048036038101906102249190610d9e565b6106b5565b6040516102369190610f16565b60405180910390f35b61025960048036038101906102549190610d9e565b6107a8565b6040516102669190610f16565b60405180910390f35b61028960048036038101906102849190610d0b565b6107c6565b6040516102969190611013565b60405180910390f35b6060600380546102ae90611177565b80601f01602080910402602001604051908101604052809291908181526020018280546102da90611177565b80156103275780601f106102fc57610100808354040283529160200191610327565b820191906000526020600020905b81548152906001019060200180831161030a57829003601f168201915b5050505050905090565b600061034561033e61084c565b8484610854565b6001905092915050565b6000610359610c4e565b600254816000600181106103705761036f611207565b5b602002018181525050610381610c4e565b602081602084600060f4600019f161039857600080fd5b806000600181106103ac576103ab611207565b5b60200201519250505090565b60006103c5848484610a1e565b60008060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600061040f61084c565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508281101561048f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161048690610f93565b60405180910390fd5b6104ac8561049b61084c565b85846104a791906110bb565b610854565b60019150509392505050565b6000600560009054906101000a900460ff16905090565b60006105706104dc61084c565b84846000806104e961084c565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461056b9190611065565b610854565b6001905092915050565b6000610584610c70565b6002548160006002811061059b5761059a611207565b5b6020020181815250508273ffffffffffffffffffffffffffffffffffffffff16816001600281106105cf576105ce611207565b5b6020020181815250506105e0610c4e565b602081604084600060f0600019f16105f757600080fd5b8060006001811061060b5761060a611207565b5b602002015192505050919050565b60606004805461062890611177565b80601f016020809104026020016040519081016040528092919081815260200182805461065490611177565b80156106a15780601f10610676576101008083540402835291602001916106a1565b820191906000526020600020905b81548152906001019060200180831161068457829003601f168201915b5050505050905090565b6000600254905090565b6000806000806106c361084c565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082811015610780576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161077790610ff3565b60405180910390fd5b61079d61078b61084c565b85858461079891906110bb565b610854565b600191505092915050565b60006107bc6107b561084c565b8484610a1e565b6001905092915050565b60008060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156108c4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108bb90610fd3565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610934576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161092b90610f73565b60405180910390fd5b806000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92583604051610a119190611013565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610a8e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a8590610fb3565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610afe576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610af590610f53565b60405180910390fd5b610b10610b0961084c565b8383610c49565b610b18610c92565b60025481600060048110610b2f57610b2e611207565b5b6020020181815250508373ffffffffffffffffffffffffffffffffffffffff1681600160048110610b6357610b62611207565b5b6020020181815250508273ffffffffffffffffffffffffffffffffffffffff1681600260048110610b9757610b96611207565b5b6020020181815250508181600360048110610bb557610bb4611207565b5b602002018181525050610bc6610c4e565b602081608084600060f1600019f1610bdd57600080fd5b8373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef85604051610c3a9190611013565b60405180910390a35050505050565b505050565b6040518060200160405280600190602082028036833780820191505090505090565b6040518060400160405280600290602082028036833780820191505090505090565b6040518060800160405280600490602082028036833780820191505090505090565b600081359050610cc381611426565b92915050565b600081359050610cd88161143d565b92915050565b600060208284031215610cf457610cf3611236565b5b6000610d0284828501610cb4565b91505092915050565b60008060408385031215610d2257610d21611236565b5b6000610d3085828601610cb4565b9250506020610d4185828601610cb4565b9150509250929050565b600080600060608486031215610d6457610d63611236565b5b6000610d7286828701610cb4565b9350506020610d8386828701610cb4565b9250506040610d9486828701610cc9565b9150509250925092565b60008060408385031215610db557610db4611236565b5b6000610dc385828601610cb4565b9250506020610dd485828601610cc9565b9150509250929050565b610de781611101565b82525050565b6000610df882611049565b610e028185611054565b9350610e12818560208601611144565b610e1b8161123b565b840191505092915050565b6000610e33602383611054565b9150610e3e8261124c565b604082019050919050565b6000610e56602283611054565b9150610e618261129b565b604082019050919050565b6000610e79602883611054565b9150610e84826112ea565b604082019050919050565b6000610e9c602583611054565b9150610ea782611339565b604082019050919050565b6000610ebf602483611054565b9150610eca82611388565b604082019050919050565b6000610ee2602583611054565b9150610eed826113d7565b604082019050919050565b610f018161112d565b82525050565b610f1081611137565b82525050565b6000602082019050610f2b6000830184610dde565b92915050565b60006020820190508181036000830152610f4b8184610ded565b905092915050565b60006020820190508181036000830152610f6c81610e26565b9050919050565b60006020820190508181036000830152610f8c81610e49565b9050919050565b60006020820190508181036000830152610fac81610e6c565b9050919050565b60006020820190508181036000830152610fcc81610e8f565b9050919050565b60006020820190508181036000830152610fec81610eb2565b9050919050565b6000602082019050818103600083015261100c81610ed5565b9050919050565b60006020820190506110286000830184610ef8565b92915050565b60006020820190506110436000830184610f07565b92915050565b600081519050919050565b600082825260208201905092915050565b60006110708261112d565b915061107b8361112d565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156110b0576110af6111a9565b5b828201905092915050565b60006110c68261112d565b91506110d18361112d565b9250828210156110e4576110e36111a9565b5b828203905092915050565b60006110fa8261110d565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b83811015611162578082015181840152602081019050611147565b83811115611171576000848401525b50505050565b6000600282049050600182168061118f57607f821691505b602082108114156111a3576111a26111d8565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080fd5b6000601f19601f8301169050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206160008201527f6c6c6f77616e6365000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b61142f816110ef565b811461143a57600080fd5b50565b6114468161112d565b811461145157600080fd5b5056fea26469706673582212200e0db9b771e2461600735438d4e479dd0e07fa6c371bb77ca63674f2edbe3fa564736f6c6343000807003300000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000002540be3ff000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000003434b4200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003434b420000000000000000000000000000000000000000000000000000000000"
    }])
    let response = await getTxReceipt(ethers.provider, txHash, 20)
    console.log("contractAddress:", response.contractAddress)
    return response.contractAddress
}

async function prepareFailedTxContract(solFailedTxContractPath) {
    let contractInfo = await ethers.getContractFactory(solFailedTxContractPath);
    let contractInfo1 = await ethers.getContractFactory(solFailedTxContractPath);
    let contractInfo2 = await ethers.getContractFactory(solFailedTxContractPath);

    let contract1 = await contractInfo1.deploy()
    contract = await contractInfo.deploy()
    let contract2 = await contractInfo2.deploy()
    await contract2.deployed();
    await contract.deployed();
    await contract1.deployed();
    //deploy ckb proxy address
    let ckbProxyAddress = await deployCkbProxyContact();
    //invoke prepare method
    console.log("ckbProxyAddress:", ckbProxyAddress)
    await contract.prepare(contract1.address, contract2.address, ckbProxyAddress, {"value": "0x123450"})
    return contract;
}

async function invoke_before_test_after(contract, modTypeArray, illStyle, expectedIsFailedTx, expectedIsLow080Panic, waitBlockNum = 1) {
    let beforeModArray = []
    let afterModArray = []
    console.log("check data before invoke failed tx")
    for (let i = 0; i < modTypeArray.length; i++) {
        let beforeMod = await contract.getModHash(modTypeArray[i])
        beforeModArray.push(beforeMod)
    }
    if (expectedIsFailedTx) {
        let txHashResponse = await contract.test(modTypeArray, illStyle, {"gasLimit": "0x1e8480"});
        await checkResponseOfFailedTx(txHashResponse.hash, expectedIsLow080Panic)
    } else {
        let txHash = await contract.test(modTypeArray, illStyle);
        await txHash.wait(waitBlockNum)
    }
    console.log("check data after invoke failed tx")
    for (let i = 0; i < modTypeArray.length; i++) {
        try {
            let afterMod = await contract.getModHash(modTypeArray[i])
            afterModArray.push(afterMod)
        } catch (e) {
            afterModArray.push(e.toString())
        }

    }
    console.log("before data:", beforeModArray)
    console.log("after data", afterModArray)
    return {beforeModArray, afterModArray}
}