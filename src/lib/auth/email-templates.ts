// ============================================================================
// UDYOGSETU (उद्योगसेतू) — PRODUCTION AUTHENTICATION EMAIL TEMPLATES
// Branded, Accessible & Multilingual (English & Marathi) Industrial Notice Templates
// ============================================================================

export interface EmailTemplatePayload {
  toEmail: string;
  recipientName: string;
  subject: string;
  htmlBody: string;
  textBody: string;
}

export const authEmailTemplates = {
  /**
   * 1. Welcome & Email Verification
   */
  verificationEmail(params: {
    recipientName: string;
    verificationUrl: string;
  }): { subject: string; htmlBody: string; textBody: string } {
    const subject = 'Verify your email address • UdyogSetu Industrial Network';
    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F4F4F5; margin: 0; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E4E4E7; overflow: hidden;">
    <div style="background-color: #18181B; padding: 24px; text-align: center;">
      <h1 style="color: #F59E0B; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">उद्योगसेतू • UDYOGSETU</h1>
      <p style="color: #A1A1AA; margin: 4px 0 0 0; font-size: 11px;">Chakan–Khed Industrial Employment Network</p>
    </div>
    <div style="padding: 32px 24px; color: #18181B;">
      <h2 style="font-size: 18px; font-weight: 800; margin-top: 0;">Welcome, ${params.recipientName}!</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #52525B;">
        Thank you for creating an account on UdyogSetu. Please confirm your email address to activate your industrial profile and receive verified vacancy alerts across Chakan MIDC and Pune.
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${params.verificationUrl}" style="background-color: #18181B; color: #FFFFFF; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 12px; text-decoration: none; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="font-size: 12px; color: #71717A; line-height: 1.5;">
        This single-use link is valid for 24 hours. If you did not create an account on UdyogSetu, you can safely ignore this email.
      </p>
    </div>
    <div style="background-color: #FAFAFA; border-top: 1px solid #F4F4F5; padding: 16px 24px; text-align: center; font-size: 11px; color: #A1A1AA;">
      UdyogSetu Chakan Desk • MIDC Central, Pune District 410501 • ₹0 Candidate Fee Guarantee
    </div>
  </div>
</body>
</html>`;
    const textBody = `Welcome ${params.recipientName}!\n\nPlease verify your UdyogSetu account by opening:\n${params.verificationUrl}\n\nValid for 24 hours.`;
    return { subject, htmlBody, textBody };
  },

  /**
   * 2. Password Reset Email
   */
  passwordResetEmail(params: {
    recipientName: string;
    resetUrl: string;
  }): { subject: string; htmlBody: string; textBody: string } {
    const subject = 'Reset your password • UdyogSetu Industrial Network';
    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F4F4F5; margin: 0; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E4E4E7; overflow: hidden;">
    <div style="background-color: #18181B; padding: 24px; text-align: center;">
      <h1 style="color: #F59E0B; margin: 0; font-size: 20px; font-weight: 800;">उद्योगसेतू • UDYOGSETU</h1>
      <p style="color: #A1A1AA; margin: 4px 0 0 0; font-size: 11px;">Account Security Notification</p>
    </div>
    <div style="padding: 32px 24px; color: #18181B;">
      <h2 style="font-size: 18px; font-weight: 800; margin-top: 0;">Password Reset Request</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #52525B;">
        Hello ${params.recipientName}, we received a request to reset the password for your UdyogSetu account. Click the button below to choose a new password:
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${params.resetUrl}" style="background-color: #D97706; color: #FFFFFF; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 12px; text-decoration: none; display: inline-block;">
          Choose New Password
        </a>
      </div>
      <p style="font-size: 12px; color: #71717A; line-height: 1.5;">
        This single-use link expires in 1 hour. If you did not request this change, your credentials remain secure and no action is required.
      </p>
    </div>
    <div style="background-color: #FAFAFA; border-top: 1px solid #F4F4F5; padding: 16px 24px; text-align: center; font-size: 11px; color: #A1A1AA;">
      Security Desk • UdyogSetu Chakan MIDC • Never share your password or OTP
    </div>
  </div>
</body>
</html>`;
    const textBody = `Hello ${params.recipientName},\n\nReset your password at:\n${params.resetUrl}\n\nExpires in 1 hour.`;
    return { subject, htmlBody, textBody };
  },

  /**
   * 3. Team Member Invitation Email
   */
  teamInvitationEmail(params: {
    companyName: string;
    inviterName: string;
    roleName: string;
    inviteUrl: string;
    expiresInDays: number;
  }): { subject: string; htmlBody: string; textBody: string } {
    const subject = `Invitation: Join ${params.companyName} on UdyogSetu as ${params.roleName}`;
    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F4F4F5; margin: 0; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E4E4E7; overflow: hidden;">
    <div style="background-color: #18181B; padding: 24px; text-align: center;">
      <h1 style="color: #F59E0B; margin: 0; font-size: 20px; font-weight: 800;">उद्योगसेतू • UDYOGSETU</h1>
      <p style="color: #A1A1AA; margin: 4px 0 0 0; font-size: 11px;">Corporate Recruitment Team Invitation</p>
    </div>
    <div style="padding: 32px 24px; color: #18181B;">
      <h2 style="font-size: 18px; font-weight: 800; margin-top: 0;">You've Been Invited to Join ${params.companyName}</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #52525B;">
        ${params.inviterName} has invited you to join the recruitment team for <strong>${params.companyName}</strong> on the UdyogSetu industrial network.
      </p>
      <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 12px; padding: 14px 18px; margin: 20px 0;">
        <span style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #92400E; display: block;">Assigned Role</span>
        <span style="font-size: 16px; font-weight: 800; color: #78350F;">${params.roleName}</span>
      </div>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${params.inviteUrl}" style="background-color: #18181B; color: #FFFFFF; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 12px; text-decoration: none; display: inline-block;">
          Accept Team Invitation
        </a>
      </div>
      <p style="font-size: 12px; color: #71717A; line-height: 1.5;">
        This invitation is valid for ${params.expiresInDays} days and is non-transferable.
      </p>
    </div>
    <div style="background-color: #FAFAFA; border-top: 1px solid #F4F4F5; padding: 16px 24px; text-align: center; font-size: 11px; color: #A1A1AA;">
      Corporate HR Desk • UdyogSetu Chakan MIDC & Pune Belt
    </div>
  </div>
</body>
</html>`;
    const textBody = `You've been invited by ${params.inviterName} to join ${params.companyName} as ${params.roleName}.\n\nAccept at:\n${params.inviteUrl}\n\nValid for ${params.expiresInDays} days.`;
    return { subject, htmlBody, textBody };
  },

  /**
   * 4. Password Changed Notification
   */
  passwordChangedAlert(params: {
    recipientName: string;
    changedAt: string;
  }): { subject: string; htmlBody: string; textBody: string } {
    const subject = 'Security Notice: Your UdyogSetu password was changed';
    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F4F4F5; margin: 0; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E4E4E7; overflow: hidden;">
    <div style="background-color: #18181B; padding: 20px; text-align: center;">
      <h1 style="color: #F59E0B; margin: 0; font-size: 18px; font-weight: 800;">उद्योगसेतू • UDYOGSETU</h1>
    </div>
    <div style="padding: 24px; color: #18181B;">
      <h2 style="font-size: 16px; font-weight: 800; margin-top: 0;">Password Updated Successfully</h2>
      <p style="font-size: 13px; color: #52525B; line-height: 1.5;">
        Hello ${params.recipientName}, the password for your UdyogSetu account was updated on <strong>${params.changedAt}</strong>.
      </p>
      <p style="font-size: 12px; color: #DC2626; line-height: 1.5;">
        If you did not make this change, please immediately reset your password and contact security@udyogsetu.internal.
      </p>
    </div>
  </div>
</body>
</html>`;
    const textBody = `Your UdyogSetu password was changed on ${params.changedAt}. If you did not authorize this, contact security@udyogsetu.internal immediately.`;
    return { subject, htmlBody, textBody };
  },
};
