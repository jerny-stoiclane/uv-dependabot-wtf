/* eslint-disable react-google-translate/no-conditional-text-nodes-with-siblings */
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import { convertMarkdownToPdf, formatCovered } from './markdownParser';

const BenefitConfirmationPdfDocument = ({ data }: { data: any }) => {
  const employeeInfo = data?.employeeInfo || {};
  const employeeAddress = data?.employeeAddress?.join('\n') || 'N/A';
  const confForm = data?.confForm || {};
  const totalCost = data?.totalCost || '0.00';

  const benefitsKeys = [
    'MED',
    'DEN',
    'VIS',
    'STD',
    'ACC',
    'CRI',
    'HOS',
    'LIF',
    'GTL',
    'LTD',
    'PET',
    'IDT',
    'LGL',
    'TEL',
    'LDA',
    'SDA',
  ];

  // the benefits confirmation form includes markdown formatting
  const confirmationMarkdown =
    confForm.fieldList?.find((field: any) => field.fieldId === 'mark1')
      ?.fieldDefault[0] || '';

  const benefitsConfirmationContent =
    convertMarkdownToPdf(confirmationMarkdown);

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <Text style={styles.header}>Benefit Confirmation Statement</Text>
        <View style={styles.row}>
          <Image
            src="/logo.png"
            style={{ width: '25%', marginRight: 60, marginBottom: 40 }}
          />
          <View style={{ flex: 1, textAlign: 'left', marginHorizontal: 10 }}>
            <Text>{employeeInfo.employeeName || 'N/A'}</Text>
            <Text>{employeeAddress}</Text>
          </View>
          <View style={{ textAlign: 'right', fontSize: 10 }}>
            <Text>
              Confirmation Number: {employeeInfo.confirmCode || 'N/A'}
            </Text>
            <Text>Employee ID: {employeeInfo.employeeId || 'N/A'}</Text>
            <Text>Confirmed: {employeeInfo.confirmDate || 'N/A'}</Text>
            <Text>IP Address: {employeeInfo.IP || 'N/A'}</Text>
          </View>
        </View>

        {benefitsKeys.map((key, idx) => {
          const section = data[key];
          if (section && section.data && section.data.length > 0) {
            return (
              <View key={key} wrap={false}>
                {idx > 0 && <Text break />}
                <View style={styles.container}>
                  <Text style={styles.sectionHeader}>
                    {section.headers.section}
                  </Text>
                  <View style={styles.row}>
                    <Text style={{ width: '30%' }}>Policy</Text>
                    <Text style={{ flex: 1 }}>Covered</Text>
                    <Text style={{ width: '15%' }}>Effective Date</Text>
                    <Text style={{ width: '20%', textAlign: 'right' }}>
                      Cost {data.periodType || 'per period'}
                    </Text>
                  </View>
                  {section.data.map((item: any, index: number) => (
                    <View key={index} style={styles.row}>
                      <Text style={{ width: '30%' }}>{item.policy}</Text>
                      <Text style={{ flex: 1 }}>
                        {formatCovered(item.covers)}
                      </Text>
                      <Text style={{ width: '15%' }}>{item.effective}</Text>
                      <Text
                        style={{
                          width: '20%',
                          textAlign: 'right',
                          fontFamily: 'Helvetica-Bold',
                          fontWeight: 'bold',
                        }}
                      >
                        ${item.cost}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          }
          if (section && section.waived === 'Y') {
            return (
              <View key={key} wrap={false}>
                {idx > 0 && <Text break />}
                <View style={styles.container}>
                  <Text style={styles.sectionHeader}>
                    {section.headers.section}
                  </Text>
                  <View style={styles.row}>
                    <Text style={{ fontStyle: 'italic', color: 'gray' }}>
                      Benefit election waived.
                    </Text>
                  </View>
                </View>
              </View>
            );
          }
          return null;
        })}

        <Text style={styles.totalCost}>
          Total cost per period: ${totalCost}
        </Text>

        <Text style={styles.confirmation}>
          {confForm.name || 'Confirmation (Armhr Portal)'}
        </Text>
        <View style={styles.confirmationContent}>
          {benefitsConfirmationContent}
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  body: {
    fontFamily: 'Helvetica',
    padding: 30,
    fontSize: 10,
    lineHeight: 1.6,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1677ff',
    color: '#fff',
    padding: 10,
    paddingBottom: 0,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionHeader: {
    backgroundColor: '#eaeaea',
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
    borderBottom: '1px solid #cccccc',
  },
  text: {
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  link: {
    color: '#1677ff',
    textDecoration: 'none',
  },
  paragraph: {
    marginBottom: 5,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderStyle: 'solid',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    borderBottomStyle: 'solid',
    padding: 5,
  },
  totalCost: {
    fontSize: 14,
    padding: 10,
    paddingBottom: 0,
    color: '#fff',
    backgroundColor: '#1677ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  confirmation: {
    backgroundColor: '#eaeaea',
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottom: '1px solid #cccccc',
  },
  confirmationContent: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderStyle: 'solid',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    lineHeight: 1.4,
  },
});

export default BenefitConfirmationPdfDocument;
