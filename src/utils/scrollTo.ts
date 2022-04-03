import { MutableRefObject } from "react";

const scrollTo = (reactNode: MutableRefObject<any>['current'], to:number, duration:number)=> {
  if (duration <= 0) return;
  var difference = to - reactNode.scrollTop;
  var perTick = difference / duration * 10;

  setTimeout(function() {
    reactNode.scrollTop = reactNode.scrollTop + perTick;
      if (reactNode.scrollTop === to) return;
      scrollTo(reactNode, to, duration - 10);
  }, 10);
}

export default scrollTo