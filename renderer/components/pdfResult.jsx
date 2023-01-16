import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
// import ReactPdfTable from "react-pdf-table";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    margin: "26px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  entree: {
    fontSize: "18px",
  },
  table: {
    display: "flex",
    flexDirection: "row",
    fontSize: "11px",
    padding: "4px 0 4px 0",
    border: "1px solid black",
  },
  subtitle: {
    fontSize: "12px",
  },
  subtitleBold: {
    fontSize: "12px",
    fontFamily: "Helvetica-Bold",
    paddingTop: "10px",
  },
  subwrapper: {
    padding: "10px 0 10px 0",
  },
});

const pageStyle = {
  paddingTop: 16,
  paddingHorizontal: 40,
  paddingBottom: 56,
};

const tableStyle = {
  display: "table",
  width: "auto",
};

const tableRowStyle = {
  flexDirection: "row",
};

const firstTableColHeaderStyle = {
  width: "30%",
  borderStyle: "solid",
  borderColor: "#000",
  borderBottomColor: "#000",
  borderWidth: 1,
  backgroundColor: "#bdbdbd",
  fontFamily: "Helvetica-Bold",
};

const tableColHeaderStyle = {
  width: "30%",
  borderStyle: "solid",
  borderColor: "#000",
  borderBottomColor: "#000",
  borderWidth: 1,
  borderLeftWidth: 0,
  backgroundColor: "#bdbdbd",
  fontFamily: "Helvetica-Bold",
};

const firstTableColStyle = {
  width: "30%",
  borderStyle: "solid",
  borderColor: "#000",
  borderWidth: 1,
  borderTopWidth: 0,
};

const tableColStyle = {
  width: "30%",
  borderStyle: "solid",
  borderColor: "#000",
  borderWidth: 1,
  borderLeftWidth: 0,
  borderTopWidth: 0,
};

const tableCellHeaderStyle = {
  textAlign: "left",
  margin: 4,
  fontSize: 12,
  fontFamily: "Helvetica-Bold",
};

const tableCellStyle = {
  textAlign: "left",
  margin: 5,
  fontSize: 10,
};
const tableCellStyleTotal = {
  textAlign: "left",
  margin: 5,
  fontSize: 10,
  fontFamily: "Helvetica-Bold",
};

// Create Document Component
function MyDocument({ incomePerCategorie, expensePerCategorie, totalIncome, totalExpense, infos }) {
  console.log(incomePerCategorie);
  return (
    <Document>
      <Page size="A4" style={pageStyle} orientation="portrait">
        <View style={tableStyle}>
          <Text style={styles.title}>Compte de résultat</Text>
          {infos && (
            <View style={styles.subwrapper}>
              <Text style={styles.subtitle}>{infos.name}</Text>
              <Text style={styles.subtitle}>Période fiscale : {infos.year}</Text>
              <Text style={styles.subtitle}>Réf : {infos.ref}</Text>
              <Text style={styles.subtitle}> </Text>
              <Text style={styles.subtitleBold}>Chiffre d'affaire</Text>
            </View>
          )}
          <View style={tableRowStyle} fixed>
            <View style={firstTableColHeaderStyle}>
              <Text style={tableCellHeaderStyle}>Compte</Text>
            </View>
            <View style={tableColHeaderStyle}>
              <Text style={tableCellHeaderStyle}>Montant</Text>
            </View>
          </View>
          {incomePerCategorie.map((input, index) => {
            if (input.total != 0) {
              return (
                <View key={index} style={tableRowStyle}>
                  <View style={firstTableColStyle}>
                    <Text style={tableCellStyle}>{input.categorie}</Text>
                  </View>
                  <View style={tableColStyle}>
                    <Text style={tableCellStyle}>{input.total} CHF</Text>
                  </View>
                </View>
              );
            }
          })}
          <View style={tableRowStyle}>
            <View style={firstTableColStyle}>
              <Text style={tableCellStyle}> </Text>
            </View>
            <View style={tableColStyle}>
              <Text style={tableCellStyle}> </Text>
            </View>
          </View>
          <View style={tableRowStyle}>
            <View style={firstTableColStyle}>
              <Text style={tableCellStyleTotal}>Total </Text>
            </View>
            <View style={tableColStyle}>
              <Text style={tableCellStyleTotal}>{totalIncome} CHF</Text>
            </View>
          </View>
          <View style={styles.subwrapper}>
            <Text style={styles.subtitle}></Text>
            <Text style={styles.subtitleBold}>Charges</Text>
          </View>

          <View style={tableRowStyle} fixed>
            <View style={firstTableColHeaderStyle}>
              <Text style={tableCellHeaderStyle}>Compte</Text>
            </View>
            <View style={tableColHeaderStyle}>
              <Text style={tableCellHeaderStyle}>Montant</Text>
            </View>
          </View>
          {expensePerCategorie.map((input, index) => {
            if (input.total != 0) {
              return (
                <View key={index} style={tableRowStyle}>
                  <View style={firstTableColStyle}>
                    <Text style={tableCellStyle}>{input.categorie}</Text>
                  </View>
                  <View style={tableColStyle}>
                    <Text style={tableCellStyle}>{input.total} CHF</Text>
                  </View>
                </View>
              );
            }
          })}
          <View style={tableRowStyle}>
            <View style={firstTableColStyle}>
              <Text style={tableCellStyle}> </Text>
            </View>
            <View style={tableColStyle}>
              <Text style={tableCellStyle}> </Text>
            </View>
          </View>
          <View style={tableRowStyle}>
            <View style={firstTableColStyle}>
              <Text style={tableCellStyleTotal}>Total </Text>
            </View>
            <View style={tableColStyle}>
              <Text style={tableCellStyleTotal}>{totalExpense} CHF</Text>
            </View>
          </View>
          <View>
            <Text style={styles.subtitle}></Text>
            <Text style={styles.subtitleBold}>Résultat : {(totalIncome - totalExpense).toFixed(2)} CHF</Text>
          </View>
          {/* <View style={tableRowStyle}>
            <View style={firstTableColStyle}>
              <Text style={tableCellStyle}> </Text>
            </View>
            <View style={tableColStyle}>
              <Text style={tableCellStyle}> </Text>
            </View>
          </View>
          <View style={tableRowStyle}>
            <View style={firstTableColStyle}>
              <Text style={tableCellStyle}></Text>
            </View>
            <View style={tableColStyleMedium}>
              <Text style={tableCellStyle}></Text>
            </View>
            <View style={tableColStyleSmall}>
              <Text style={tableCellStyle}></Text>
            </View>
            <View style={tableColStyle}>
              <Text style={tableCellStyleTotal}>Total</Text>
            </View>
          </View> */}
        </View>
      </Page>
    </Document>
  );
}

export default MyDocument;
