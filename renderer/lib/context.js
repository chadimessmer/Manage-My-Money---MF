import React, { createContext, useContext, useState, useEffect } from "react";

const ComptaContext = createContext();

export const StateContext = ({ children }) => {
  const [income, setIncome] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [expense, setExpense] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [incomeCategorie, setIncomeCategorie] = useState(["Vente", "Autre", "Concert", "Enseignement"]);
  const [expenseCategorie, setExpenseCategorie] = useState([
    "Communications",
    "Représentation",
    "Achat matériel",
    "Loyer",
    "Frais de transports",
    "Assurances",
  ]);
  const [name, setName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [infos, setInfos] = useState({});

  useEffect(() => {
    if (transaction.length > 0) {
      console.log(transaction);
      let totalIn = 0;
      let totalOut = 0;
      let incomeList = [];
      let expenseList = [];
      for (const facture of transaction) {
        if (facture.prix != "") {
          let thisFacture = parseFloat(facture.prix);
          if (facture.in) {
            totalIn += thisFacture;
            incomeList.push(facture);
          } else {
            totalOut += thisFacture;
            expenseList.push(facture);
          }
        }
      }
      setIncome(incomeList);
      setExpense(expenseList);
      setTotalIncome(totalIn.toFixed(2));
      setTotalExpense(totalOut.toFixed(2));
    } else {
      setTotalIncome(0);
      setTotalExpense(0);
    }
    setBalance(totalIncome - totalExpense);
  }, [transaction]);

  // useEffect(() => {
  //   if (expense.length > 0) {
  //     let total = 0;
  //     for (const facture of expense) {
  //       if (facture.prix != "") {
  //         let thisFacture = parseFloat(facture.prix);
  //         total += thisFacture;
  //       }
  //     }
  //     setTotalExpense(total.toFixed(2));
  //   } else {
  //     setTotalExpense(0);
  //   }
  //   setBalance(totalIncome - totalExpense);
  // }, [expense]);

  return (
    <ComptaContext.Provider
      value={{
        infos,
        setInfos,
        expenseCategorie,
        setExpenseCategorie,
        incomeCategorie,
        setIncomeCategorie,
        balance,
        setBalance,
        totalExpense,
        setTotalExpense,
        income,
        setIncome,
        expense,
        setExpense,
        totalIncome,
        setTotalIncome,
        transaction,
        setTransaction,
      }}
    >
      {children}
    </ComptaContext.Provider>
  );
};

export const useStateContext = () => useContext(ComptaContext);
