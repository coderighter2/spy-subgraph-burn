import { BigInt } from "@graphprotocol/graph-ts"
import {
  Transfer
} from "../generated/SpyToken/SpyToken"
import { Burn, Info } from "../generated/schema"

let DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD"

export function handleTransfer(event: Transfer): void {
  if (event.params.to.toHex().toLowerCase() == DEAD_ADDRESS.toLowerCase()) {

    let info = Info.load("info-base");
    if (!info) {
      info = new Info("info-base");
      info.totalAmount = event.params.value;
      info.count = 1;
      info.save();
    } else {
      info.totalAmount = info.totalAmount.plus(event.params.value);
      info.count ++;
      info.save();
    }

    let burnId = "burn-".concat(event.transaction.hash.toHex())
    let burn = new Burn(burnId)
    burn.index = info.count - 1;
    burn.amount = event.params.value
    burn.from = event.params.from
    burn.creationTime = event.block.timestamp
    burn.txid = event.transaction.hash
    burn.save()
  }
}
