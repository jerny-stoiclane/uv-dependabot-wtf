import { Helmet } from 'react-helmet';

import PrismPage from '../PrismPage';

const AdminPayrollApprovalPage = () => {
  return (
    <>
      <Helmet>
        <title>Payroll Approvals | Armhr</title>
        <meta
          name="description"
          content="Review and approve payroll as an administrator."
        />
      </Helmet>
      <PrismPage
        queryString="&redirectUrl=ess/manager/payroll-approvals&hideNavHeader=True&lang=en"
        title="Payroll approvals"
      />
    </>
  );
};

export default AdminPayrollApprovalPage;
