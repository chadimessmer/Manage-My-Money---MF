import { AiFillHome } from "react-icons/ai";
import Link from "next/link";
import { GiReceiveMoney, GiPayMoney, GiSave } from "react-icons/gi";
import { FaBalanceScaleLeft } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { GrTransaction } from "react-icons/gr";
import { useStateContext } from "../lib/context";

export default function Nav() {
  const { transaction, incomeCategorie, expenseCategorie, infos } = useStateContext();

  const handleDownload = () => {
    let exportValues = [infos, incomeCategorie, expenseCategorie, transaction];
    console.log(exportValues);
    let dataStr = JSON.stringify(exportValues);
    let dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    let exportFileDefaultName = "test.json";

    let element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(dataStr));
    element.setAttribute("download", exportFileDefaultName);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };
  return (
    <div className="nav">
      <GiSave onClick={() => handleDownload()} className="menu-right" />
      <div className="menu">
        <Link href="/home">
          <AiFillHome />
        </Link>
        <Link href="/transactions">
          <GrTransaction className="icon" />
        </Link>
        {/* <Link href="/expense">
        <GiPayMoney />
      </Link> */}
        <Link href="/balance">
          <FaBalanceScaleLeft />
        </Link>
      </div>
    </div>
  );
}
