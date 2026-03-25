"use client";
import React, { useMemo } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  Linking,
  useColorScheme,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import BackButton from "@/components/back";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivacyPolicy = () => {
  const scheme = useColorScheme() ?? "light";
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert("Error", "Unable to open email client");
    });
  };

  const handleWebsitePress = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open website");
    });
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: C.background,
        },
        contentContainer: {
          padding: 16,
          paddingBottom: 32,
        },
        headerContainer: {
          marginBottom: 20,
          paddingLeft: 16,
        },
        companyTitle: {
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 12,
          color: C.text,
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 12,
          color: C.text,
        },
        subsectionTitle: {
          fontSize: 14,
          fontWeight: "600",
          marginTop: 12,
          marginBottom: 8,
          color: C.text,
        },
        paragraph: {
          fontSize: 14,
          lineHeight: 22,
          marginBottom: 12,
          color: C.text,
          textAlign: "justify",
        },
        linkText: {
          color: C.primary,
          textDecorationLine: "underline",
        },
        list: {
          marginBottom: 12,
        },
        listItem: {
          fontSize: 14,
          lineHeight: 22,
          marginBottom: 8,
          marginLeft: 16,
          color: C.text,
        },
        contactList: {
          marginBottom: 12,
          paddingLeft: 16,
        },
        contactItem: {
          fontSize: 14,
          lineHeight: 22,
          marginBottom: 8,
          color: C.text,
        },
        contactLabel: {
          fontWeight: "600",
          color: C.text,
        },
        divider: {
          height: 1,
          backgroundColor: C.border,
          marginVertical: 16,
        },
      }),
    [C],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <BackButton />
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ThemedText style={styles.companyTitle}>
          BRANE DIGITAL ASSETS LIMITED
        </ThemedText>
        <ThemedText style={styles.companyTitle}>PRIVACY POLICY</ThemedText>

        {/* 1. INTRODUCTION */}
        <ThemedText style={styles.sectionTitle}>1. INTRODUCTION</ThemedText>
        <ThemedText style={styles.paragraph}>
          Brane Technologies Limited (&quot;Brane&quot;, &quot;We&quot;, &quot;Our&quot; or &quot;Us&quot;) respects
          your privacy and is committed to protecting your personal data. This
          privacy policy (the &quot;Policy&quot;) will inform you as to how we look after
          your personal data when you engage our services or visit our website
          and informs you about your privacy rights and how the law protects
          you. By visiting{" "}
          <ThemedText
            style={styles.linkText}
            onPress={() => handleWebsitePress("https://www.getbrane.co")}
          >
            www.getbrane.co
          </ThemedText>
          , you are accepting and consenting to the practices described in this
          Policy.
        </ThemedText>

        {/* 2. IMPORTANT INFORMATION AND WHO WE ARE */}
        <ThemedText style={styles.sectionTitle}>
          2. IMPORTANT INFORMATION AND WHO WE ARE
        </ThemedText>
        <ThemedText style={styles.subsectionTitle}>
          (a) THE PURPOSE OF THIS PRIVACY POLICY
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          This Policy aims to give you information on how Brane collects and
          processes your personal data, including any data you may provide
          through our website when you sign up to our newsletters, send us an
          inquiry, engage our services or communicate with us otherwise.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          It is important that you read this Policy together with any legal
          notices, cookie policy, and any other fair processing policy we may
          provide when we are collecting or processing personal data about you
          so that you are fully aware of how and why we are using your data.
        </ThemedText>

        <ThemedText style={styles.subsectionTitle}>
          (b) RESPONSIBILITY FOR THIS PRIVACY POLICY
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Ezekiel Imole is the designated Data Protection Officer of Brane who
          will be responsible for compliance with this Policy and relevant data
          protection legislation.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          If you have any questions about this Policy or our privacy practices,
          please contact our DPO in the following ways:
        </ThemedText>

        <View style={styles.contactList}>
          <ThemedText style={styles.contactItem}>
            <ThemedText style={styles.contactLabel}>Name:</ThemedText> Ezekiel
            Imole
          </ThemedText>
          <ThemedText
            style={styles.contactItem}
            onPress={() => handleEmailPress("info@getbrane.co")}
          >
            <ThemedText style={styles.contactLabel}>Email address: </ThemedText>
            <ThemedText style={styles.linkText}>info@getbrane.co</ThemedText>
          </ThemedText>
          <ThemedText style={styles.contactItem}>
            <ThemedText style={styles.contactLabel}>Address:</ThemedText> 188,
            Awolowo Road, Ikoyi, Lagos
          </ThemedText>
          <ThemedText style={styles.contactItem}>
            <ThemedText style={styles.contactLabel}>
              Telephone number:
            </ThemedText>{" "}
            +2348141805564
          </ThemedText>
        </View>

        <ThemedText style={styles.subsectionTitle}>
          (c) CHANGES TO THE PRIVACY POLICY AND YOUR DUTY TO INFORM US OF
          CHANGES
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          We keep our Policy under regular review.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          It is important that the Personal Data we hold about you is accurate
          and current. Please keep us informed if your Personal Data changes
          during your relationship with us.
        </ThemedText>

        <ThemedText style={styles.subsectionTitle}>
          (d) PROTECTION OF PERSONAL DATA ON THIRD-PARTY LINKS?
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Our website may include links to third-party websites, plug-ins and
          applications. Clicking on those links or enabling those connections
          may allow third parties to collect or share data about you. We do not
          control these third-party websites, we are not responsible for their
          privacy statements, and we do not accept any responsibility for their
          use of your personal information. When you leave our website, we
          encourage you to read the privacy policy of every website you visit.
        </ThemedText>

        {/* 3. THE INFORMATION THAT WE COLLECT */}
        <ThemedText style={styles.sectionTitle}>
          3. THE INFORMATION THAT WE COLLECT
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          We may collect personal data, i.e., any information relating to an
          identified or identifiable natural person. An identifiable natural
          person is one who can be identified, directly or indirectly, in
          particular by reference to an identifier such as a name, an
          identification number, location data, an online identifier, or to one
          or more factors specific to the physical, physiological, genetic,
          mental, economic, cultural, or social identity of that natural person.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          It can be anything from a name, address, a photo, an email address,
          bank details, posts on social networking websites, medical
          information, and other unique identifiers such as, but not limited to,
          MAC address, IP address, IMEI number, IMSI number, SIM, Personal
          Identifiable Information (PII), and others (&quot;Personal Data&quot;).
        </ThemedText>

        {/* 4. HOW WE COLLECT, PROCESS, USE AND SHARE PERSONAL DATA */}
        <ThemedText style={styles.sectionTitle}>
          4. HOW WE COLLECT, PROCESS, USE AND SHARE PERSONAL DATA
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          4.1. We may collect your Personal Data using forms, email and physical
          requests, cookies, JWT, web tokens, or third-party applications. You
          can set your browser to refuse all or some browser cookies, or to
          alert you if we access cookies. If you disable or refuse cookies,
          please note that some parts of our website may become inaccessible or
          not function properly.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          4.2. We use your Personal Data for verification of your identity;
          human resources management; access to computer systems and third-party
          software; know-your-customer and due diligence purposes; recruitment
          purposes; regulatory compliance; performance of a contract with you;
          compliance with legal obligations; marketing; litigation; events
          planning and hosting; in-house security; research, analysis, and other
          business purposes or legitimate interests.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          4.3. When you send email or other communications to us, we may retain
          those communications to process your inquiries, respond to your
          requests, or improve our services provided on our platform. We may
          also collect information while providing our services to you. Our
          servers automatically record information that your browser sends
          whenever you visit our platform.
        </ThemedText>

        {/* 5. CONSENT AND ACCESS RIGHTS */}
        <ThemedText style={styles.sectionTitle}>
          5. CONSENT AND ACCESS RIGHTS
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          5.1. We will obtain your consent prior to collecting or processing
          your Personal Data. Where we intend to use the information for a
          purpose other than the purpose for which it was collected, prior to
          such use, we will request your consent.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          5.2. No consent shall be sought, given, or accepted in any
          circumstance that may engender direct or indirect propagation of
          atrocities, hate, child rights violation, criminal acts, and
          anti-social conducts.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          5.3. You may withdraw your consent at any time and may request access
          to your Personal Data in our possession. Such withdrawal will not
          affect the lawfulness of the processing of your Personal Data prior to
          the withdrawal of your consent. We can, however, deny you access to
          the information where we determine that your request is unreasonable.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          5.4. You have the right to request the modification or amendment of
          your Personal Data in our possession.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          5.5. In all cases of access or request for modification or amendment
          of Personal Data, we shall request sufficient identification to enable
          us to confirm that you are the owner of the data sought to be
          accessed, modified, or amended.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          5.6. Where you provide the Personal Data of a third party to us, you
          confirm to us that you have informed the owner of the data about the
          purpose for which the data is required and that you have obtained the
          consent of the owner of the data to provide the data to us for the
          purpose for which it is required and in accordance with this Policy.
        </ThemedText>

        {/* 6. PERSONAL DATA PROTECTION PRINCIPLES */}
        <ThemedText style={styles.sectionTitle}>
          6. PERSONAL DATA PROTECTION PRINCIPLES
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          When we process Personal Data, we are guided by the following
          principles. Personal Data shall be:
        </ThemedText>
        <View style={styles.list}>
          <ThemedText style={styles.listItem}>
            6.1. collected only for specific, legitimate and lawful purposes;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            6.2. processed lawfully for the purpose for which it was collected
            and not further processed in a manner incompatible with that
            purpose(s);
          </ThemedText>
          <ThemedText style={styles.listItem}>
            6.3. processed adequately, accurately and without prejudice to the
            dignity of the human person;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            6.4. adequate, relevant and limited to what is necessary in relation
            to the purpose for which it is processed;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            6.5. accurate and where necessary, kept up to date;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            6.6. stored only for the period within which it is reasonably
            needed; and
          </ThemedText>
          <ThemedText style={styles.listItem}>
            6.7. processed in a secure manner and protected against unauthorized
            or unlawful access or processing or accidental loss, destruction or
            damage.
          </ThemedText>
        </View>

        {/* 7. SECURITY MEASURES */}
        <ThemedText style={styles.sectionTitle}>
          7. SECURITY MEASURES
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          We have put in place and will maintain appropriate security measures
          to prevent your Personal Data from being used, accessed, altered or
          disclosed in an unauthorized way.
        </ThemedText>

        {/* 8. ACCESS BY THIRD PARTIES */}
        <ThemedText style={styles.sectionTitle}>
          8. ACCESS BY THIRD PARTIES
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          We may share your Personal Data with third parties in the following
          circumstances:
        </ThemedText>
        <View style={styles.list}>
          <ThemedText style={styles.listItem}>
            1. where we have your consent;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            2. with our parent company(ies), subsidiary, or affiliates when it
            is required to perform a contractual obligation due to you; for the
            verification of your identity;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            3. where we provide such information to other professional advisers
            or other trusted businesses or persons for the purpose of processing
            Personal Data on our behalf or other legitimate business purposes.
            We would require such parties to process such information based on
            our instructions and in compliance with this Policy and any other
            appropriate confidentiality and security measures;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            4. where we have a legal basis that access, use, preservation or
            disclosure of such information is reasonably necessary to:
          </ThemedText>
          <ThemedText style={[styles.listItem, { marginLeft: 32 }]}>
            • satisfy any applicable law, regulation, legal process, or
            enforceable governmental request,
          </ThemedText>
          <ThemedText style={[styles.listItem, { marginLeft: 32 }]}>
            • enforce applicable terms of service, including investigation of
            potential violations thereof,
          </ThemedText>
          <ThemedText style={[styles.listItem, { marginLeft: 32 }]}>
            • detect, prevent, or otherwise address fraud, security or technical
            issues, or
          </ThemedText>
          <ThemedText style={[styles.listItem, { marginLeft: 32 }]}>
            • protect against imminent harm to our rights, property, or safety
            as required or permitted by law.
          </ThemedText>
        </View>

        {/* 9. TRANSFER OF PERSONAL DATA OUTSIDE THE COUNTRY */}
        <ThemedText style={styles.sectionTitle}>
          9. TRANSFER OF PERSONAL DATA OUTSIDE THE COUNTRY
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          9.1. We may transfer Personal Data outside Nigeria in the following
          circumstances:
        </ThemedText>
        <View style={styles.list}>
          <ThemedText style={styles.listItem}>1. with your consent;</ThemedText>
          <ThemedText style={styles.listItem}>
            2. the transfer is necessary for the performance of a contract
            between you and Brane or the implementation of pre-contractual
            measures taken at your request;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            3. the transfer is necessary for the conclusion or performance of a
            contract concluded in your interest between Brane and another
            natural or legal person;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            4. the transfer is necessary for important reasons of public
            interest;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            5. the transfer is necessary for the establishment, exercise, or
            defense of legal claims;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            6. the transfer is necessary in order to protect your vital
            interests; or of other persons, where you are physically or legally
            incapable of giving consent.
          </ThemedText>
        </View>

        <ThemedText style={styles.paragraph}>
          9.2. We are a Nigerian company, and our website is subject to the laws
          of the Federal Republic of Nigeria. If you are accessing our website
          from other jurisdictions, please be advised that you are transferring
          your personal data to us in Nigeria, and by using our website, you are
          agreeing to the transfer and use of your Personal Data in accordance
          with this Policy. You also agree to abide by the laws of the Federal
          Republic of Nigeria concerning your use of the Platform and your
          agreements with us.
        </ThemedText>

        <ThemedText style={styles.paragraph}>
          9.3. We may engage the services of third parties in order to process
          your Personal Data. The processing by such third parties shall be
          governed by a written contract with Brane to ensure adequate
          protection and security measures put in place by the third party for
          the protection of your Personal Data in accordance with the terms of
          this Policy and the relevant data protection laws in Nigeria.
        </ThemedText>

        <ThemedText style={styles.paragraph}>
          9.4. The transfer of your Personal Data out of Nigeria would be in
          accordance with the provisions of the Nigeria Data Protection Act,
          2023. We shall put adequate measures in place to ensure the security
          of such data. In particular, we shall, among other things, conduct a
          detailed assessment of whether the said country is on the Whitelist of
          countries with adequate data protection laws. By consenting to the
          processing of your Personal Data, you consent to the transfer of your
          Personal Data outside Nigeria.
        </ThemedText>

        {/* 10. RETENTION OF PERSONAL DATA */}
        <ThemedText style={styles.sectionTitle}>
          10. RETENTION OF PERSONAL DATA
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          10.1. We will only retain your Personal Data for as long as reasonably
          necessary to fulfil the purposes we collected it for, including for
          the purposes of satisfying any legal, regulatory, tax, accounting or
          reporting requirements. We may retain your Personal Data for a longer
          period in the event of a compliant or if we reasonably believe there
          is a prospect of litigation in respect to our relationship with you.
          Where information is kept for a longer period, such as in backup
          storage, or archives, such information would be safeguarded in
          accordance with this Policy.
        </ThemedText>

        <ThemedText style={styles.paragraph}>
          10.2. To determine the appropriate retention period for Personal Data,
          we consider the amount, nature and sensitivity of the Personal Data,
          the potential risk of harm from unauthorized use or disclosure of your
          Personal Data, the purposes for which we process your Personal Data
          and whether we can achieve those purposes through other means, and the
          applicable legal, regulatory, reporting or other requirements.
        </ThemedText>

        <ThemedText style={styles.paragraph}>
          10.3. Where any information retained is stored in an encrypted format,
          considerations must be taken for secure storage of the encryption
          keys. Encryption keys must be retained as long as the data that the
          keys decrypt is retained.
        </ThemedText>

        <ThemedText style={styles.paragraph}>
          10.4. In some circumstances, we will anonymise your Personal Data (so
          that it can no longer be associated with you) for research or
          statistical purposes, in which case we may retain and use this
          information indefinitely without further notice to you.
        </ThemedText>

        {/* 11. VIOLATIONS */}
        <ThemedText style={styles.sectionTitle}>11. VIOLATIONS</ThemedText>
        <ThemedText style={styles.paragraph}>
          We will take swift action to remedy any suspected breaches of Personal
          Data.
        </ThemedText>

        <ThemedText style={styles.paragraph}>
          We will not be responsible for any breach of Personal Data which
          occurs as a result of:
        </ThemedText>

        <View style={styles.list}>
          <ThemedText style={styles.listItem}>
            (a) an event which is beyond our control;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            (b) an act or threats of terrorism;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            (c) any act of God (including but not limited to fires, explosions,
            earthquakes, floods, epidemics, or pandemics) which compromises our
            data protection measures;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            (d) war, hostilities (whether war be declared or not), invasion, act
            of foreign enemies, requisition, or embargo, rebellion, revolution,
            insurrection, or military or usurped power, or civil war which
            compromises our data protection measures;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            (e) the transfer of your Personal Data to a third party on your
            instructions; or
          </ThemedText>
          <ThemedText style={styles.listItem}>
            (f) the use of your Personal Data by a third party designated by
            you.
          </ThemedText>
        </View>

        <ThemedText style={styles.paragraph}>
          If you know or suspect that a breach of Personal Data has occurred, or
          a violation of this Policy has occurred, you should immediately
          contact the Data Protection Officer at{" "}
          <ThemedText
            style={styles.linkText}
            onPress={() => handleEmailPress("info@getbrane.co")}
          >
            info@getbrane.co
          </ThemedText>
          .
        </ThemedText>

        <ThemedText style={styles.paragraph}>
          Violations of this Policy by employees may result in disciplinary
          action.
        </ThemedText>

        {/* 12. YOUR LEGAL RIGHTS */}
        <ThemedText style={styles.sectionTitle}>
          12. YOUR LEGAL RIGHTS
        </ThemedText>
        <ThemedText style={styles.paragraph}>You have the right to:</ThemedText>

        <View style={styles.list}>
          <ThemedText style={styles.listItem}>
            (a) Request access to your Personal Data (commonly known as a &apos;data
            subject access request&apos;). This enables you to receive a copy of the
            Personal Data we hold about you and to check that we are lawfully
            processing it.
          </ThemedText>

          <ThemedText style={styles.listItem}>
            (b) Request correction of the Personal Data that we hold about you.
            This enables you to have any incomplete or inaccurate data we hold
            about you corrected, though we may need to verify the accuracy of
            the new data you provide to us.
          </ThemedText>

          <ThemedText style={styles.listItem}>
            (c) Request erasure of your Personal Data. This enables you to ask
            us to delete or remove Personal Data where there is no good reason
            for us to continue to process it. You also have the right to ask us
            to delete or remove your Personal Data where you have successfully
            exercised your right to object to processing, where we may have
            processed your information unlawfully or where we are required to
            erase your Personal Data to comply with local law. Note, however,
            that we may not always be able to comply with your request of
            erasure for specific legal reasons which will be notified to you, if
            applicable, at the time of your request.
          </ThemedText>

          <ThemedText style={styles.listItem}>
            (d) Object to processing of your Personal Data where we are relying
            on a legitimate interest (or those of a third party) and there is
            something about your particular situation which makes you want to
            object to processing on this ground as you feel it impacts on your
            fundamental rights and freedoms. You also have the right to object
            where we are processing your Personal Data for direct marketing
            purposes. In some cases, we may demonstrate that we have compelling
            legitimate grounds to process your information which override your
            rights and freedoms.
          </ThemedText>

          <ThemedText style={styles.listItem}>
            (e) Request restriction of processing of your Personal Data. This
            enables you to ask us to suspend the processing of your Personal
            Data in the following scenarios:
          </ThemedText>
          <View style={[styles.list, { marginLeft: 32 }]}>
            <ThemedText style={styles.listItem}>
              • If you want us to establish the data&apos;s accuracy.
            </ThemedText>
            <ThemedText style={styles.listItem}>
              • Where our use of the data is unlawful but you do not want us to
              erase it.
            </ThemedText>
            <ThemedText style={styles.listItem}>
              • Where you need us to hold the data even if we no longer require
              it as you need it to establish, exercise or defend legal claims.
            </ThemedText>
            <ThemedText style={styles.listItem}>
              • You have objected to our use of your Personal Data but we need
              to verify whether we have overriding legitimate grounds to use it.
            </ThemedText>
          </View>

          <ThemedText style={styles.listItem}>
            (f) Request the transfer of your Personal Data to you or to a third
            party. We will provide to you, or a third party you have chosen,
            your Personal Data in a structured, commonly used, machine-readable
            format. Note that this right only applies to automated information
            which you initially provided consent for us to use or where we used
            the information to perform a contract with you.
          </ThemedText>

          <ThemedText style={styles.listItem}>
            (g) Withdraw consent at any time where we are relying on consent to
            process your Personal Data. However, this will not affect the
            lawfulness of any processing carried out before you withdraw your
            consent. If you withdraw your consent, we may not be able to provide
            certain products or services to you. We will advise you if this is
            the case at the time you withdraw your consent.
          </ThemedText>
        </View>

        <ThemedText style={styles.paragraph}>
          If you wish to exercise any of the rights set out above, contact the
          Data Protection Officer at{" "}
          <ThemedText
            style={styles.linkText}
            onPress={() => handleEmailPress("info@getbrane.co")}
          >
            info@getbrane.co
          </ThemedText>
          .
        </ThemedText>

        <ThemedText style={styles.paragraph}>
          You will not have to pay a fee to:
        </ThemedText>

        <View style={styles.list}>
          <ThemedText style={styles.listItem}>
            (a) access your Personal Data;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            (b) change your Personal Data provided to us;
          </ThemedText>
          <ThemedText style={styles.listItem}>
            (c) or to exercise any of the other rights.
          </ThemedText>
        </View>

        <ThemedText style={styles.paragraph}>
          Notwithstanding the above, we will charge a reasonable fee where:
        </ThemedText>

        <View style={styles.list}>
          <ThemedText style={styles.listItem}>
            (a) any of your requests is clearly unfounded, repetitive, or
            excessive. Alternatively, we could refuse to comply with your
            request in these circumstances if any criminal or illegal activity
            is suspected.
          </ThemedText>
          <ThemedText style={styles.listItem}>
            (b) you request to change your Personal Data in our possession more
            than three (3) times within a twelve (12) month period.
          </ThemedText>
        </View>

        <ThemedText style={styles.paragraph}>
          We may need to request specific information from you to help us
          confirm your identity and ensure your right to access your Personal
          Data (or to exercise any of your other rights). This is a security
          measure to ensure that Personal Data is not disclosed to any person
          who has no right to receive it. We may also contact you to ask you for
          further information in relation to your request to speed up our
          response.
        </ThemedText>

        <ThemedText style={styles.paragraph}>
          We try to respond to all legitimate requests within one month.
          Occasionally it could take us longer than a month if your request is
          particularly complex or you have made a number of requests. In this
          case, we will notify you and keep you updated.
        </ThemedText>

        {/* 13. CONTACT US */}
        <ThemedText style={styles.sectionTitle}>13. CONTACT US</ThemedText>
        <ThemedText style={styles.paragraph}>
          If you wish to exercise any of your rights under this Policy or know
          or suspect that a breach of your Personal Data or a violation of this
          Policy has occurred, or if you have any questions about this Policy or
          our privacy practices, please contact us at{" "}
          <ThemedText
            style={styles.linkText}
            onPress={() => handleEmailPress("info@getbrane.co")}
          >
            info@getbrane.co
          </ThemedText>
          .
        </ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
