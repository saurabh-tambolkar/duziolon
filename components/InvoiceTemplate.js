// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
// } from "@react-pdf/renderer";

// const styles = StyleSheet.create({
//   page: {
//     padding: 35,
//     fontSize: 12,
//     fontFamily: "Helvetica",
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 30,
//   },

//   companyName: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },

//   invoiceTitle: {
//     fontSize: 28,
//     fontWeight: "bold",
//   },

//   section: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 25,
//   },

//   title: {
//     fontWeight: "bold",
//     marginBottom: 5,
//   },

//   table: {
//     marginTop: 20,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },

//   row: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//     paddingVertical: 10,
//   },

//   head: {
//     backgroundColor: "#f4f4f4",
//     fontWeight: "bold",
//   },

//   col1: {
//     width: "45%",
//     paddingLeft: 10,
//   },

//   col2: {
//     width: "15%",
//     textAlign: "center",
//   },

//   col3: {
//     width: "20%",
//     textAlign: "center",
//   },

//   col4: {
//     width: "20%",
//     textAlign: "right",
//     paddingRight: 10,
//   },

//   total: {
//     marginTop: 30,
//     alignItems: "flex-end",
//   },

//   totalText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },

//   footer: {
//     marginTop: 60,
//     textAlign: "center",
//     color: "grey",
//   },
// });

// export default function InvoicePDF({ order }) {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>

//         <View style={styles.header}>
//           <View>
//             <Text style={styles.companyName}>DUZIOLON</Text>
//             <Text>Premium Fashion Store</Text>
//             <Text>Pune, Maharashtra</Text>
//           </View>

//           <View>
//             <Text style={styles.invoiceTitle}>INVOICE</Text>
//             <Text>#{order._id}</Text>
//           </View>
//         </View>

//         <View style={styles.section}>
//           <View>
//             <Text style={styles.title}>Billing To</Text>

//             {/* <Text>{order.address.fullName}</Text>
//             <Text>{order.address.address}</Text>
//             <Text>{order.address.city}</Text>
//             <Text>{order.address.state}</Text>
//             <Text>{order.address.mobile}</Text> */}
//           </View>

//           <View>
//             <Text style={styles.title}>Payment</Text>

//             <Text>{order.paymentMethod}</Text>
//             <Text>{order.status}</Text>
//           </View>
//         </View>

//         <View style={styles.table}>

//           <View style={[styles.row, styles.head]}>
//             <Text style={styles.col1}>Product</Text>
//             <Text style={styles.col2}>Qty</Text>
//             <Text style={styles.col3}>Price</Text>
//             <Text style={styles.col4}>Total</Text>
//           </View>

//           {order.items.map(item => (

//             <View style={styles.row} key={item._id}>

//               <Text style={styles.col1}>
//                 {item.productId.name}
//               </Text>

//               <Text style={styles.col2}>
//                 {item.quantity}
//               </Text>

//               <Text style={styles.col3}>
//                 ₹{item.price}
//               </Text>

//               <Text style={styles.col4}>
//                 ₹{item.quantity * item.price}
//               </Text>

//             </View>

//           ))}

//         </View>

//         <View style={styles.total}>
//           <Text style={styles.totalText}>
//             Grand Total : ₹{order.totalAmount}
//           </Text>
//         </View>

//         <View style={styles.footer}>
//           <Text>
//             Thank you for shopping with DUZIOLON ❤️
//           </Text>
//         </View>

//       </Page>
//     </Document>
//   );
// }






// import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
// import { Font } from "@react-pdf/renderer";

// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: "#fafafa",
//     padding: 35,
//     fontFamily: "Helvetica",
//     fontSize: 11,
//     color: "#111827",
//   },

//   //---------------- HEADER ----------------//

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 35,
//   },

//   logo: {
//     fontSize: 30,
//     fontWeight: "bold",
//   },

//   subtitle: {
//     marginTop: 6,
//     color: "#666",
//     fontSize: 12,
//   },

//   invoiceTitle: {
//     fontSize: 38,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },

//   invoiceCard: {
//     width: 220,
//     border: "1 solid #E5E7EB",
//     borderRadius: 10,
//     padding: 18,
//   },

//   invoiceRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },

//   label: {
//     color: "#6B7280",
//   },

//   value: {
//     fontWeight: "bold",
//   },

//   paid: {
//     backgroundColor: "#DCFCE7",
//     color: "#15803D",
//     padding: 6,
//     borderRadius: 20,
//     textAlign: "center",
//     fontWeight: "bold",
//     marginTop: 10,
//   },

//   //---------------- BILLING ----------------//

//   sectionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 30,
//     gap: 20,
//   },

//   card: {
//     flex: 1,
//     border: "1 solid #E5E7EB",
//     borderRadius: 10,
//     padding: 16,
//   },

//   sectionTitle: {
//     fontSize: 13,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },

//   text: {
//     marginBottom: 4,
//     color: "#444",
//   },

//   //---------------- TABLE ----------------//

//   table: {
//     border: "1 solid #E5E7EB",
//     borderRadius: 8,
//     marginBottom: 25,
//   },

//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#F9FAFB",
//     borderBottom: "1 solid #E5E7EB",
//     paddingVertical: 10,
//     fontWeight: "bold",
//   },

//   row: {
//     flexDirection: "row",
//     borderBottom: "1 solid #F3F4F6",
//     paddingVertical: 12,
//     alignItems: "center",
//   },

//   colProduct: {
//     width: "45%",
//     paddingLeft: 10,
//   },

//   col: {
//     width: "18%",
//     textAlign: "center",
//   },

//   totalCol: {
//     width: "19%",
//     textAlign: "right",
//     paddingRight: 10,
//   },

//   productTitle: {
//     fontWeight: "bold",
//   },

//   productColor: {
//     color: "#666",
//     marginTop: 3,
//   },

//   //---------------- BOTTOM ----------------//

//   bottom: {
//     flexDirection: "row",
//     marginTop: 20,
//     gap: 20,
//   },

//   summaryCard: {
//     flex: 1,
//     border: "1 solid #E5E7EB",
//     borderRadius: 10,
//     padding: 18,
//   },

//   supportCard: {
//     flex: 1,
//     border: "1 solid #E5E7EB",
//     borderRadius: 10,
//     padding: 18,
//   },

//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },

//   divider: {
//     borderBottom: "1 solid #E5E7EB",
//     marginVertical: 12,
//   },

//   grandTotal: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },

//   footer: {
//     marginTop: 40,
//     borderTop: "1 solid #E5E7EB",
//     paddingTop: 15,
//     textAlign: "center",
//     color: "#6B7280",
//     fontSize: 10,
//   },
// });

// export default function InvoicePDF({ order }) {
//   console.log("object");
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* HEADER */}

//         <View style={styles.header}>
//           <View>
//             <Text style={styles.logo}>DUZIOLON</Text>
//             <Text style={styles.invoiceTitle}>INVOICE</Text>
//             <Text style={styles.subtitle}>
//               Thank you for shopping with Duziolon.
//             </Text>
//           </View>

//           {/* <View style={styles.invoiceCard}>
//             <View style={styles.invoiceRow}>
//               <Text style={styles.label}>Invoice No.</Text>
//               <Text style={styles.value}>
//                 INV-{order._id.toString().slice(-6)}
//               </Text>
//             </View>

//             <View style={styles.invoiceRow}>
//               <Text style={styles.label}>Order ID</Text>
//               <Text style={styles.value}>
//                 #{order._id.toString().slice(-8)}
//               </Text>
//             </View>

//             <View style={styles.invoiceRow}>
//               <Text style={styles.label}>Invoice Date</Text>
//               <Text>
//                 {new Date(order.createdAt).toLocaleDateString("en-IN")}
//               </Text>
//             </View>

//             <View style={styles.invoiceRow}>
//               <Text style={styles.label}>Transaction</Text>
//               <Text>{order.transactionId}</Text>
//             </View>

//             <View style={styles.invoiceRow}>
//               <Text style={styles.label}>Payment</Text>
//               <Text>{order.paymentStatus}</Text>
//             </View>

//             <View style={styles.invoiceRow}>
//               <Text style={styles.label}>Order Status</Text>
//               <Text>{order.status}</Text>
//             </View>
//           </View> */}
//         </View>

//         {/* BILLING */}

//         {/* <View style={styles.sectionRow}>
//           <View style={styles.card}>
//             <Text style={styles.sectionTitle}>BILL TO</Text>

//             <Text>{order.userId.name}</Text>
//             <Text style={styles.text}>{order.userId.email}</Text>
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.sectionTitle}>SHIP TO</Text>

//             <Text>{order.address.fullName}</Text>
//             <Text style={styles.text}>{order.address.mobile}</Text>
//             <Text style={styles.text}>{order.address.address}</Text>
//             <Text style={styles.text}>
//               {order.address.city}, {order.address.state}
//             </Text>
//           </View>
//         </View> */}

//         {/* PRODUCTS */}

//         <View style={styles.table}>
//           <View style={styles.tableHeader}>
//             <Text style={styles.colProduct}>PRODUCT</Text>
//             <Text style={styles.col}>QTY</Text>
//             <Text style={styles.col}>PRICE</Text>
//             <Text style={styles.totalCol}>TOTAL</Text>
//           </View>

//           {order.items.map((item) => (
//             <View key={item._id.toString()} style={styles.row}>
//               <View style={styles.colProduct}>
//                 <Text style={styles.productTitle}>{item.productId.name}</Text>

//                 <View style={styles.colProduct}>

//                   <Text style={styles.productColor}>Size : {item.size}</Text>

//                 </View>
//               </View>

//               <Text style={styles.col}>{item.quantity}</Text>

//               <Text style={styles.col}>₹{item.price}</Text>

//               <Text style={styles.totalCol}>₹{item.price * item.quantity}</Text>
//             </View>
//           ))}
//         </View>

//         {/* BOTTOM */}

//         <View style={styles.bottom}>
//           <View style={styles.summaryCard}>
//             <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>

//             <View style={styles.summaryRow}>
//               <Text>Subtotal</Text>
//               <Text>₹{order.amount}</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text>Discount</Text>
//               <Text>₹{order.couponCodeDiscount}</Text>
//             </View>

//             <View style={styles.summaryRow}>
//               <Text>Shipping</Text>
//               <Text>FREE</Text>
//             </View>

//             <View style={styles.summaryRow}>
//               <Text>Taxes</Text>
//               <Text>Included</Text>
//             </View>

//             <View style={styles.divider} />

//             <View style={styles.summaryRow}>
//               <Text style={styles.grandTotal}>Grand Total</Text>

//               <Text style={styles.grandTotal}>₹{order.amountPaid}</Text>
//             </View>
//           </View>

//           <View style={styles.supportCard}>
//             <Text style={styles.sectionTitle}>NEED HELP?</Text>

//             <Text style={styles.text}>support@duziolon.com</Text>

//             <Text style={styles.text}>+91 9876543210</Text>

//             <Text style={styles.text}>Mon - Sat | 10 AM - 7 PM</Text>

//             <Text
//               style={{
//                 marginTop: 25,
//                 fontSize: 18,
//                 fontWeight: "bold",
//               }}
//             >
//               Thank You!
//             </Text>

//             <Text style={{ marginTop: 8 }}>We appreciate your purchase.</Text>
//           </View>
//         </View>

//         {/* FOOTER */}

//         <Text style={styles.footer}>
//           www.duziolon.com • support@duziolon.com • © 2026 Duziolon
//         </Text>
//       </Page>
//     </Document>
//   );
// }


import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#fff",
    fontSize: 11,
    fontFamily: "Helvetica",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  left: {
    width: "45%",
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 150,
    height: 150,
    objectFit: "contain",
    marginRight: 2,
  },

  company: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },

  invoice: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  subtitle: {
    color: "#666",
    fontSize: 11,
  },

  right: {
    width: "42%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,

    flexDirection: "column",
    justifyContent: "space-between",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    color: "#666",
    fontWeight: "bold",
  },

  value: {
    fontWeight: "bold",
    textAlign: "right",
  },

  paid: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  addressWrapper: {
    flexDirection: "row",
    gap: 20,
    marginTop: 5,
  },

  addressCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },

  addressTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },

  addressText: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },

  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingVertical: 10,
    alignItems: "center",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingVertical: 12,
    alignItems: "center",
  },

  productCol: {
    width: "46%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  sizeCol: {
    width: "12%",
    textAlign: "center",
    fontSize: 11,
  },

  qtyCol: {
    width: "12%",
    textAlign: "center",
    fontSize: 11,
  },

  priceCol: {
    width: "15%",
    textAlign: "right",
    fontSize: 11,
    paddingRight: 10,
  },

  totalCol: {
    width: "15%",
    textAlign: "right",
    fontSize: 11,
    fontWeight: "bold",
    paddingRight: 10,
  },

  productImage: {
    width: 50,
    height: 50,
    objectFit: "contain",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
  },

  productInfo: {
    marginLeft: 10,
    flex: 1,
  },

  productName: {
    fontSize: 11,
    fontWeight: "bold",
  },

  productColor: {
    fontSize: 10,
    color: "#777",
    marginTop: 2,
  },
   bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 20,
  },

  summaryCard: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 18,
    backgroundColor: "#FFFFFF",
  },

  supportCard: {
    width: "48%",
    padding: 18,
    justifyContent: "space-between",
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 18,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },

  summaryLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },

  summaryValue: {
    fontSize: 12,
    fontWeight: "bold",
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    marginVertical: 12,
  },

  grandLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },

  grandValue: {
    fontSize: 22,
    fontWeight: "bold",
  },

  helpTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },

  helpText: {
    fontSize: 11,
    color: "#666",
    lineHeight: 1.6,
    marginBottom: 20,
  },

  thankYou: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },

  appreciation: {
    fontSize: 12,
    color: "#444",
    fontWeight: "bold",
  },
});

export default function InvoicePDF({ data }) {



  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <View style={styles.header}>

          {/* LEFT */}

          <View style={styles.left}>

           <Image src={`${process.env.NEXT_PUBLIC_BASE_URL}/mainImage.png`}
              style={styles.logo}
            />

            <View>

              <Text style={styles.company}>
                DUZIOLON
              </Text>

              <Text style={styles.invoice}>
                INVOICE
              </Text>

              <Text style={styles.subtitle}>
                Thank you for shopping with us
              </Text>

            </View>

          </View>

          {/* RIGHT */}

          <View style={styles.right}>

            <View style={styles.row}>
              <Text style={styles.label}>
                Order ID
              </Text>

              <Text style={styles.value}>
                #{data._id.toString().slice(-8)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Invoice Date
              </Text>

              <Text style={styles.value}>
                {new Date(data.time).toLocaleDateString("en-IN")}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Payment Method
              </Text>

              <Text style={styles.value}>
                PhonePe
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Payment Status
              </Text>

              <Text style={styles.paid}>
                Paid
              </Text>
            </View>

          </View>

        </View>
        {/* Addresses */}

<View style={styles.addressWrapper}>

  <View style={styles.addressCard}>
    <Text style={styles.addressTitle}>
      Delivery Address
    </Text>

    <Text style={styles.addressText}>
      {data.address.flat} {data.address.street}, {data.address.landmark}
    </Text>

    <Text style={styles.addressText}>
      {data.address.city} {data.address.taluqa} {data.address.district}
    </Text>

    <Text style={styles.addressText}>
      {data.address.postalCode}
    </Text>
  </View>

  <View style={styles.addressCard}>
    <Text style={styles.addressTitle}>
      Shipping Address
    </Text>

    <Text style={styles.addressText}>
      {data.address.flat} {data.address.street}, {data.address.landmark}
    </Text>

    <Text style={styles.addressText}>
      {data.address.city} {data.address.taluqa} {data.address.district}
    </Text>

    <Text style={styles.addressText}>
      {data.address.postalCode}
    </Text>
  </View>

</View>

{/* Products */}

<View style={styles.table}>

  <View style={styles.tableHeader}>

    <Text style={styles.productCol}>
      Product
    </Text>

    <Text style={styles.sizeCol}>
      Size
    </Text>

    <Text style={styles.qtyCol}>
      Qty
    </Text>

    <Text style={styles.priceCol}>
      Price
    </Text>

    <Text style={styles.totalCol}>
      Total
    </Text>

  </View>

  {data.items.map((item) => (

    <View
      key={item._id}
      style={styles.tableRow}
    >

      <View style={styles.productCol}>

        <Image
          src={item.product.image.url}
          style={styles.productImage}
        />

        <View style={styles.productInfo}>

          <Text style={styles.productName}>
            {item.product.name}
          </Text>

          <Text style={styles.productColor}>
            {item.product.color}
          </Text>

        </View>

      </View>

      <Text style={styles.sizeCol}>
        {item.size}
      </Text>

      <Text style={styles.qtyCol}>
        {item.quantity}
      </Text>

      <Text style={styles.priceCol}>
        Rs. {Number(item.price).toLocaleString()}
      </Text>

      <Text style={styles.totalCol}>
        Rs. {(Number(item.price) * item.quantity).toLocaleString()}
      </Text>

    </View>

  ))}

</View>

<View style={styles.bottomSection}>

  {/* ORDER SUMMARY */}

  <View style={styles.summaryCard}>

    <Text style={styles.sectionHeading}>
      ORDER SUMMARY
    </Text>

    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>
        Subtotal
      </Text>

      <Text style={styles.summaryValue}>
        Rs. {Number(data.totalAmount).toLocaleString()}
      </Text>
    </View>

    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>
        Discount
      </Text>

      <Text style={styles.summaryValue}>
        Rs. {Number(data.couponCodeDiscount).toLocaleString()}
      </Text>
    </View>

    <View style={styles.divider} />

    <View style={styles.summaryRow}>
      <Text style={styles.grandLabel}>
        Grand Total
      </Text>

      <Text style={styles.grandValue}>
        Rs. {Number(data.totalAmountPaid).toLocaleString()}
      </Text>
    </View>

  </View>

  {/* NEED HELP */}

  <View style={styles.supportCard}>

    <Text style={styles.helpTitle}>
      Need Help?
    </Text>

    <Text style={styles.helpText}>
      If you have any issues with your purchase, our support team is always
      happy to assist you.
    </Text>

    <Text style={styles.thankYou}>
      THANK YOU!
    </Text>

    <Text style={styles.appreciation}>
      We appreciate your purchase.
    </Text>

  </View>

</View>

<View
  style={{
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 16,
    alignItems: "center",
  }}
>
  <Text
    style={{
      fontSize: 10,
      color: "#6B7280",
      marginBottom: 4,
    }}
  >
    Thank you for shopping with DUZIOLON.
  </Text>

  <Text
    style={{
      fontSize: 9,
      color: "#9CA3AF",
    }}
  >
    This is a computer generated invoice and does not require a signature.
  </Text>

  <Text
    style={{
      fontSize: 9,
      color: "#9CA3AF",
      marginTop: 6,
    }}
  >
    www.duziolon.com • support@duziolon.com • +91 98765 43210
  </Text>

  <Text
    style={{
      fontSize: 8,
      color: "#C0C0C0",
      marginTop: 10,
    }}
  >
    © 2026 DUZIOLON. All Rights Reserved.
  </Text>
</View>

      </Page>
    </Document>
  );
}
