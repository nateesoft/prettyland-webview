import { AppConfig } from '../Constants';

export const memberStatus = [
  { value: 1, label: AppConfig.MemberStatus.active },
  { value: 2, label: AppConfig.MemberStatus.newRegister },
  { value: 3, label: AppConfig.MemberStatus.notApprove },
  { value: 4, label: AppConfig.MemberStatus.suspend },
];

export const memberGroup = [
  { value: 1, label: 'customer' },
  { value: 2, label: 'partner' },
  { value: 2, label: 'demo' },
];

export const postStatus = [
  {
    value: AppConfig.PostsStatus.customerNewPostDone,
    label: 'โพสท์ใหม่ (new)',
  },
  {
    value: AppConfig.PostsStatus.customerCancelPost,
    label: 'ลูกค้ายกเลิก (cancel)',
  },
  {
    value: AppConfig.PostsStatus.adminConfirmNewPost,
    label: 'อนุมัติ (approve)',
  },
  {
    value: AppConfig.PostsStatus.notApprove,
    label: 'ไม่อนุมัติ (not approve)',
  },
  {
    value: AppConfig.PostsStatus.waitAdminConfirmPayment,
    label: 'รอตรวจสอบสลิปโอนเงิน (verify)',
  },
  { value: AppConfig.PostsStatus.closeJob, label: 'ปิดงานเรียบร้อย (close)' },
];
