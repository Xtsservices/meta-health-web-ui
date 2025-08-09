import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: "5px",
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  headerTextBgm: {
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#1977F3",
    color: "white",
    padding: "8px",
  },
});

interface TaxInvoiceTableDocumentProps {
  medicineList: any;
}

const TaxInvoiceTableDocument = ({
  medicineList,
}: TaxInvoiceTableDocumentProps) => {
  console.log(medicineList);

  const totalAmount = medicineList.map(
    (med: any) => med?.Frequency * med.daysCount * med.sellingPrice
  );

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.headerTextBgm}>Medicine Plan</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Medicine name</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Category</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Quantity</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>No. days</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Price</Text>
          </View>
        </View>

        {medicineList?.map((medicine: any, index: number) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{medicine.name}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{medicine.category}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {medicine?.Frequency * medicine.daysCount}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{medicine?.daysCount} days</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{medicine.sellingPrice}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.infoLabel}>
        <Text>Total Price: {totalAmount}</Text>
      </View>
    </>
  );
};

export default TaxInvoiceTableDocument;
