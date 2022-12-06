import { AiFillHome } from "react-icons/ai";
import Link from "next/link";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { FaBalanceScaleLeft } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
export default function Nav() {
  return (
    <div className="menu">
      <Link href="/home">
        <AiFillHome />
      </Link>
      <Link href="/income">
        <GiReceiveMoney />
      </Link>
      <Link href="/expense">
        <GiPayMoney />
      </Link>
      <Link href="/balance">
        <FaBalanceScaleLeft />
      </Link>
    </div>
  );
}
