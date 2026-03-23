import React, { useMemo } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

const TermsConditions = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: C.background,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 32,
    },
    backButton: {
      marginBottom: 16,
    },
    header: {
      marginBottom: 16,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "700",
      color: C.text,
    },
    lastModificationContainer: {
      marginBottom: 12,
    },
    lastModificationText: {
      fontSize: 14,
      color: C.text,
    },
    lastModificationLabel: {
      fontWeight: "600",
    },
    introductionContainer: {
      marginBottom: 12,
      gap: 12,
    },
    paragraphText: {
      fontSize: 14,
      lineHeight: 20,
      color: C.text,
    },
    sectionContainer: {
      marginTop: 20,
      marginBottom: 12,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: C.text,
      marginBottom: 8,
    },
    subsectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: C.text,
      marginBottom: 6,
    },
    subsubsectionTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: C.text,
      marginBottom: 6,
    },
    definitionContainer: {
      borderBottomWidth: 1,
      borderBottomColor: C.border,
      paddingVertical: 12,
      paddingHorizontal: 12,
      marginVertical: 2,
    },
    definitionTerm: {
      fontSize: 13,
      fontWeight: "600",
      color: C.text,
      marginBottom: 6,
    },
    definitionValue: {
      fontSize: 13,
      lineHeight: 18,
      color: C.text,
    },
    tableContainer: {
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: 4,
      overflow: "hidden",
      marginVertical: 12,
    },
    link: {
      color: C.primary,
      textDecorationLine: "underline",
    },
    listItemContainer: {
      marginVertical: 6,
      paddingLeft: 20,
    },
    listItemText: {
      fontSize: 14,
      lineHeight: 20,
      color: C.text,
      marginLeft: -20,
      paddingLeft: 20,
    },
  }), [C]);

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert(
        "Email Not Available",
        "Your device does not have an email client configured. Please contact us at " + email
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.backButton}>
          <Back onPress={() => router.back()} />
        </View>

        <View style={styles.header}>
          <ThemedText style={styles.headerText}>Terms & conditions</ThemedText>
        </View>

        <View style={styles.introductionContainer}>
          <ThemedText style={styles.lastModificationText}>
            <ThemedText style={styles.lastModificationLabel}>
              Last Modification:{" "}
            </ThemedText>
            October 4, 2024
          </ThemedText>

          <ThemedText style={styles.paragraphText}>
            Please read the following Terms and Conditions of Service (&quot;
            <ThemedText style={{ fontWeight: "600" }}>Terms</ThemedText>
            &quot;) carefully before using the Platform (as defined below). The Terms
            govern the access and use of the Platform owned and/or controlled by
            Brane Technologies Limited (&quot;
            <ThemedText style={{ fontWeight: "600" }}>Brane</ThemedText>&quot;).
          </ThemedText>

          <ThemedText style={styles.paragraphText}>
            Your access to and use of the Platform is subject to your acceptance
            of and compliance with these Terms. These Terms apply to the Users
            and others who access or use the Platform.
          </ThemedText>

          <ThemedText style={styles.paragraphText}>
            By using the Platform, you accept these Terms.
          </ThemedText>
        </View>

        {/* Section 1: Definitions and Interpretation */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            1. Definitions and Interpretation
          </ThemedText>
          <ThemedText style={styles.paragraphText}>
            In these Terms, unless the context otherwise requires, the following
            expressions have the following meanings:
          </ThemedText>

          <View style={styles.tableContainer}>
            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>"Affiliate"</ThemedText>
              <ThemedText style={styles.definitionValue}>
                means any entity, individual, firm, or corporation, directly or
                indirectly, through one or more intermediaries, controlling,
                controlled by, or under a common control with Brane;
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>"Account"</ThemedText>
              <ThemedText style={styles.definitionValue}>
                shall have the meaning given to it in paragraph 4;
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>
                "Applicable Laws"
              </ThemedText>
              <ThemedText style={styles.definitionValue}>
                means the constitution of the Federal Republic of Nigeria, any
                national, provincial, state or local law, statute, bye-law,
                ordinance, decree, directive, regulation, standard, circular,
                guideline, rule, code, delegated or subordinated legislation,
                judicial act or decision, judgment, order, proclamation,
                directive, executive order, other legislative measure, binding
                actions or enactments of the Federal Republic of Nigeria or any
                other government authority in Nigeria which is applicable to the
                use of the Platform and Services;
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>"Content"</ThemedText>
              <ThemedText style={styles.definitionValue}>
                means the Platform, and the information, writings, images and/or
                other works that the User sees, hears, or otherwise experiences
                on the Platform, including without limitations to account
                positions, balances, transactions, confirmations, and order
                history;
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>
                "Confidential Information"
              </ThemedText>
              <ThemedText style={styles.definitionValue}>
                means all information, however recorded or preserved, disclosed
                by a Party (the "Disclosing Party&quot;) or its representatives to
                another Party (the "Receiving Party&quot;) under this Terms, or that
                a Receiving Party accesses from the Disclosing Party in
                connection with the Services that Brane provides under this
                Terms that meets one of the following two criteria: the
                information either (i) is identified by a "CONFIDENTIAL" legend
                or similar legend of the Disclosing Party, or (ii) is obtained
                under circumstances such that the Receiving Party knew or
                reasonably should have known that the information should be
                treated as confidential to the Disclosing Party. Confidential
                Information includes information in any form or medium (whether
                oral, written, electronic, or other) and includes inventions;
                specifications; drawings; models; samples; reports; plans;
                financial information; work-in-progress; forecasts; computer
                programs or documentation; trade secrets; know-how; strategies;
                User Data including any User's non-public personal information;
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>
                "Data Protection Law"
              </ThemedText>
              <ThemedText style={styles.definitionValue}>
                means the Applicable Laws relating to data protection and
                privacy law, regulations, and guidelines in Nigeria, including
                the Nigerian Data Protection Act 2023 (as may be amended), and
                the Nigeria Data Protection Regulation 2019 (as may be amended);
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>
                "Login Credentials"
              </ThemedText>
              <ThemedText style={styles.definitionValue}>
                shall have the meaning in paragraph 4.2;
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>
                "Intellectual Property Rights"
              </ThemedText>
              <ThemedText style={styles.definitionValue}>
                means the patents, rights to inventions and discoveries, utility
                models, copyright, trademarks, service marks, trade, business
                and domain names, rights in trade dress or get-up, rights in
                goodwill or to sue for passing off, rights in designs, rights in
                computer software, database rights, moral rights, rights in
                confidential or proprietary information (including know-how and
                trade secrets), and any other intellectual property rights, in
                each case whether registered or unregistered and including all
                applications for and renewals or extensions of such rights, and
                all similar or equivalent rights or forms of protection in any
                part of the world belonging to Brane or its affiliates;
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>"Materials"</ThemedText>
              <ThemedText style={styles.definitionValue}>
                has the meaning given to it in paragraph 9.1;
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>
                "Personal Data"
              </ThemedText>
              <ThemedText style={styles.definitionValue}>
                means any information relating to an identified or identifiable
                natural person, including personal data or information as
                defined by the Nigeria Data Protection Regulation 2019 (NDPR) or
                any other Applicable Laws for the processing of Personal Data;
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>"Platform"</ThemedText>
              <ThemedText style={styles.definitionValue}>
                means the Brane Platform, available via website at
                www.getbrane.co;
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>
                "Registration Data"
              </ThemedText>
              <ThemedText style={styles.definitionValue}>
                has the meaning given to it in paragraph 4.3;
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>"Services"</ThemedText>
              <ThemedText style={styles.definitionValue}>
                means the services provided by Brane through the Platform
                including the purchase, sale, or transacting in:
              </ThemedText>
              <ThemedText style={[styles.definitionValue, { marginTop: 6 }]}>
                (a) general merchandise and consumer goods; and
              </ThemedText>
              <ThemedText style={[styles.definitionValue, { marginTop: 4 }]}>
                (b) voice and data plans of telecommunication companies.
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>
                "Transaction"
              </ThemedText>
              <ThemedText style={styles.definitionValue}>
                means Services undertaken by each User on the Platform.
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>"User(s)"</ThemedText>
              <ThemedText style={styles.definitionValue}>
                means Brane's clients and potential clients that accesses the
                Platform to participate in any Transaction; references to "you",
                "your" and "yours" should all be read as referring to a User.
              </ThemedText>
            </View>

            <View style={styles.definitionContainer}>
              <ThemedText style={styles.definitionTerm}>"User Data"</ThemedText>
              <ThemedText style={styles.definitionValue}>
                means all data and information regarding a User which may be
                provided by a User or gathered by Brane as part of a Transaction
                on the Platform. It includes each User's provision of content,
                including but not limited to Personal Data, Registration Data,
                Login Credentials, Confidential Information, payment
                information, biometric information, and documentational or other
                Transaction information.
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Section 2: About the Platform */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            2. About the Platform
          </ThemedText>
          <ThemedText style={styles.paragraphText}>
            Brane provides the Platform which enables Users to access the
            Services.
          </ThemedText>
        </View>

        {/* Section 3: Agreement to be Binding */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            3. Agreement to be Binding
          </ThemedText>
          <ThemedText style={styles.paragraphText}>
            By accessing, using, or interacting with the Platform, you
            acknowledge that you have read these Terms and automatically agree
            to be subject to these Terms, without any modification. If you
            disagree with any part of the Terms, you should not access the
            Platform.
          </ThemedText>
        </View>

        {/* Section 4: User Accounts */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>4. User Accounts</ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>4.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              To use the Platform, you must register and create an account (&quot;
              <ThemedText style={{ fontWeight: "600" }}>Account</ThemedText>&quot;).
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>4.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              When you set up your Account, you will be required to create
              log-in credentials by providing certain types of personal
              information such as name, email, address, phone number, date of
              birth, Bank Verification Number (BVN), bank account details, debit
              card details, next of kin details, means of identification info
              (passport photo, National Identification Number or international
              passport) (&quot;
              <ThemedText style={{ fontWeight: "600" }}>
                Login Credentials
              </ThemedText>
              &quot;).
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>4.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              In registering for the Services, you agree (a) to provide true,
              accurate, current and complete information about yourself as
              prompted by the Platform's registration form (&quot;
              <ThemedText style={{ fontWeight: "600" }}>
                Registration Data
              </ThemedText>
              &quot;); (b) not to create an Account using a false identity or
              information, or on behalf of someone other than yourself; and (c)
              to maintain and promptly update the Registration Data to keep it
              true, accurate, current and complete.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>4.4</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You are responsible for maintaining and protecting the security of
              your Account and the confidentiality of your Login Credentials,
              and you agree not to allow a third party to use your Account or
              Login Credentials at any time. You shall bear full responsibility
              for all activities with the use of your Account or Login
              Credentials.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>4.5</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You agree to promptly notify us if you become aware of or
              reasonably suspect any security breach, including any loss, theft,
              or unauthorized disclosure or use of your Login Credentials or
              password.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>4.6</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You agree to promptly update the security of your Account and the
              Login Credentials if you become aware or reasonably suspect any
              security breach, including any loss, theft, or unauthorized
              disclosure or use of your access login or password.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>4.7</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane reserves the right to terminate any Account which it
              reasonably determines may have been used by an unauthorized third
              party.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>4.8</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You agree not to create an Account or use the Services if you have
              been previously banned from the Platform unless approved by Brane.
              Such an approval shall be on a case-by-case basis.
            </ThemedText>
          </View>
        </View>

        {/* Section 5: Risk of Using the Platform and the Services */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            5. Risk of Using the Platform and the Services
          </ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>5.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              By using the Platform and the Services, you acknowledge,
              understand, and accept the following:
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>5.1.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The range of Services offered on the Platform may involve
              significant risk.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>5.1.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The User will be responsible for all its actions, directions and
              trade conducted on the Platform.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>5.1.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Confidence might also collapse because of technical problems: if
              money is lost or stolen, or if hackers or governments are able to
              prevent any transactions from settling.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>5.1.4</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The Platform and all its content are not intended to substitute
              for professional advice. You should carefully assess whether your
              financial situation and tolerance for risk is suitable for using
              the Platform and engaging our Services and consult a professional
              as necessary.
            </ThemedText>
          </View>
        </View>

        {/* Section 6: Prohibited Uses */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            6. Prohibited Uses
          </ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>6.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You may use the Platform only for lawful purposes and in
              accordance with these Terms.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>6.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You agree not to use the Platform:
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>6.2.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              In any way that violates any Applicable Law.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>6.2.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              For the purpose of exploiting, harming, or attempting to exploit
              or harm minors in any way by exposing them to inappropriate
              content, asking for personally identifiable information, or
              otherwise.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>6.2.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              To send, knowingly receive, upload, download, use, or re-use any
              material which does not comply with these Terms.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>6.2.4</ThemedText>
            <ThemedText style={styles.paragraphText}>
              To transmit, or procure the sending of, any advertising or
              promotional material, including any &quot;junk mail,&quot; &quot;chain letter,&quot;
              "spam," or any other similar solicitation.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>6.2.5</ThemedText>
            <ThemedText style={styles.paragraphText}>
              To impersonate or attempt to impersonate Brane, an employee of
              Brane, another user, or any other person or entity (including,
              without limitation, by using e-mail addresses or usernames
              associated with any of the foregoing).
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>6.2.6</ThemedText>
            <ThemedText style={styles.paragraphText}>
              To engage in any other conduct that restricts or inhibits anyone&apos;s
              use or enjoyment of the Platform, or which, as determined by
              Brane, may harm Brane or users of the Platform or expose them to
              liability.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>6.2.7</ThemedText>
            <ThemedText style={styles.paragraphText}>
              To collect or store personal data from users without their
              consent.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>6.2.12</ThemedText>
            <ThemedText style={styles.paragraphText}>
              To introduce any viruses, trojan horses, worms, logic bombs, or
              other material which is malicious or technologically harmful.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>6.2.13</ThemedText>
            <ThemedText style={styles.paragraphText}>
              To attempt to gain unauthorized access to, interfere with, damage,
              or disrupt any parts of the Platform, the server on which the
              Platform is stored, or any server, computer, or database connected
              to the Platform.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>6.2.14</ThemedText>
            <ThemedText style={styles.paragraphText}>
              To attack the Platform via a denial-of-service attack or a
              distributed denial-of-service attack.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>6.2.15</ThemedText>
            <ThemedText style={styles.paragraphText}>
              To otherwise attempt to interfere with the proper working of the
              Platform.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>6.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You agree not to sell, loan, assign, or otherwise transfer your
              Account to any other person.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>6.4</ThemedText>
            <ThemedText style={styles.paragraphText}>
              An unauthorized use of the Platform as provided in this paragraph
              6 entitles Brane to terminate your right to use the Platform as
              well as potential liability and claims depending on the
              circumstances.
            </ThemedText>
          </View>
        </View>

        {/* Section 7: Intellectual Property and Other Rights */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            7. Intellectual Property and Other Rights
          </ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>7.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The Platform is protected by applicable intellectual property and
              other laws, including trademark and copyright laws and treaties.
              The Platform, including all Intellectual Property Rights in the
              Platform, including the Content, belongs to and is the property of
              Brane or its licensors (if any). Neither these Terms nor your
              access and use of the Platform gives you any ownership rights or
              licenses to the Content.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>7.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Subject to the Terms herein, Brane grants you a limited,
              non-exclusive and non-transferable license to access and use the
              Platform for your personal use only and as otherwise expressly
              permitted in these Terms. Your limited license extends to the
              download of reports and valuation statements specific to your
              Account, but the proprietary rights over the information remain
              that of Brane or its licensors (if any).
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>7.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The rights granted to you in the Terms are subject to the
              following restrictions:
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>7.3.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You shall not license, sell, rent, lease, transfer, assign,
              reproduce, distribute, host, or otherwise commercially exploit or
              create derivative works based on the Platform, Content, and
              back-end databases, (collectively, &quot;Brane Properties&quot;) or any
              portion of Brane&apos;s Properties.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>7.3.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You shall not frame or utilize framing techniques to enclose any
              trademark, logo, or other Brane Properties (including images,
              text, page layout, or form) of Brane.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>7.3.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You shall not use any metatags or other hidden text using Brane's
              name or trademarks.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>7.3.4</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You shall not modify, translate, adapt, merge, make derivative
              works of, disassemble, decompile, reverse compile or reverse
              engineer any part of Brane's Properties except to the extent the
              foregoing restrictions are expressly prohibited by Applicable Law.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>7.3.5</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You shall not access Brane's Properties in order to build a
              similar or competitive website, application, or service.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>7.3.6</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Except as expressly stated herein, no part of Brane's Properties
              may be copied, reproduced, distributed, republished, downloaded,
              displayed, posted, or transmitted in any form or by any means.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>7.3.7</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You shall not remove or destroy any copyright notices or other
              proprietary markings contained on or in Brane's Properties.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>7.3.8</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You shall not use Brane's Properties for any illegal or unlawful
              purpose.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>7.4</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Any unauthorized use of Brane's Properties may result in the
              immediate termination of your right to use the Platform, as well
              as potential liability for copyright infringement or other claims
              depending on the circumstances.
            </ThemedText>
          </View>
        </View>

        {/* Section 8: Data Protection */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            8. Data Protection
          </ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>8.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane shall comply with the requirement of Data Protection Laws
              relating to the use of Personal Data in connection with the
              Platform.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>8.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane shall comply with the Data Protection Laws in the use and
              processing of the Personal Data of Users obtained through the
              Platform.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>8.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The User warrants that it has the legal right and authority to
              disclose any and all data disclosed on the Platform and
              indemnifies and holds Brane harmless for any violation of this
              provision.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>8.4</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The User authorizes and consents to Brane's engagement of third
              parties to provide services on the Platform as may be reasonably
              required, at Brane's sole discretion.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>8.5</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The User authorizes and grants its consent for Brane to:
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>8.5.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Review, copy, reformat, modify, display, distribute, or otherwise
              use information to provide services on the Platform.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>8.5.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Capture and store data and information relating to the User's
              account, identity validation, Transaction, and Services.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>8.5.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Store, record, distribute, alter, copy, transmit and display
              Transaction information, documents, and identity validation
              information of the User for any valid legal or business purpose,
              and further to maintain and display such information on the
              Platform&apos;s Verification Portal to Customer and other Verification
              Portal Users, including, without limitation User Confidential
              Information and User Personal Data that is part of any Transaction
              information, documents, and identity validation information.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>8.5.4</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Convey your information to other Users involved in your
              Transaction, or to those with appropriate authority, or to other
              third parties as provided by relevant agreements or applicable
              law.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>8.5.5</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Store, record, distribute, alter, copy, or otherwise use in any
              manner, format, and on any device or medium the Information from
              the Transaction for any valid legal or business purpose and no
              charge to us.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>8.5.6</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Transmit User&apos;s information to service providers in connection
              with services rendered.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>8.6</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The User represents and warrants that it has sufficient authority
              and rights to provide the grant of rights and authorizations.
            </ThemedText>
          </View>
        </View>

        {/* Section 10: System Outages */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            10. System Outages
          </ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>10.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane periodically schedules system downtime for maintenance of
              the Platform and other purposes. In addition, unplanned system
              outages also may occur. Brane does not have any liability, and you
              waive all liability whatsoever for any unavailability of the
              Platform or for any loss of data or transactions caused by planned
              or unplanned system outages or the resultant delay, mis-delivery,
              or non-delivery of information caused by such system outages.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>10.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane shall not have any responsibility or liability for any
              third-party acts or any other outages of web host providers or the
              internet infrastructure and network external to the Platform.
            </ThemedText>
          </View>
        </View>

        {/* Section 11: Consent */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>11. Consent</ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>11.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You consent to conduct electronic transactions and receive
              electronic communications through the Platform. This includes your
              consent to: (i) send and receive documents electronically; (ii)
              conduct business and complete transactions electronically. You
              understand that you are not required to give legal consent;
              however, if you decline, you will not be able to use the Platform.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>11.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You consent to the verification and authentication of your
              identity using third-party services. These methods may include
              using the Information, databases, audio and video conferencing
              technology, SMS text or email verification, or other third-party
              or other information with our Service or by third parties using
              any identity proofing methods, such as forensics, knowledge-based
              questions, biometrics, in any combination of hardware and
              software.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>11.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You grant permission to Brane to create and store an electronic
              record of all transactions and documents online and offline.
            </ThemedText>
          </View>
        </View>

        {/* Section 12: Third-Party Web Sites */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            12. Third-Party Web Sites
          </ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>12.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane may, from time to time, provide links on the Platform to
              third-party websites or information; these links are provided
              solely as a convenience to you. Such links do not constitute or
              imply an endorsement, sponsorship, or recommendation by Brane of
              the third party, the third-party website, or the information
              there.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>12.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane may, from time to time as it deems necessary, integrate the
              Platform with third-party websites, platforms, or service
              providers. The integration of the Platform with such third parties
              does not constitute or imply an endorsement, sponsorship, or
              recommendation by Brane of the third party, website, platform, or
              service provider.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>12.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane, through the Platform, has no control over, nor assumes any
              responsibility for, the content, privacy policies, or practices of
              any third-party websites or services which are accessed via the
              Platform or through which a User accesses the Platform. You
              further acknowledge and agree that Brane shall not be responsible
              or liable, directly or indirectly, for any damage or loss caused
              or alleged to be caused by or in connection with the use of or
              reliance on any such content, goods, or services available on or
              through any such third-party websites and platforms.
            </ThemedText>
          </View>
        </View>

        {/* Section 13: Downloading Files */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            13. Downloading Files
          </ThemedText>
          <ThemedText style={styles.paragraphText}>
            Brane cannot and does not guarantee or warrant that files available
            for downloading through the Platform will be free of infection by
            software viruses or other harmful computer code, files, or programs.
          </ThemedText>
        </View>

        {/* Section 14: Disclaimers */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>14. Disclaimers</ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>14.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane and its service providers, licensors, and suppliers make no
              representations about the suitability, reliability, availability,
              timeliness, security, or accuracy of the Platform or the Content
              for any purpose. To the maximum extent permitted by Applicable
              Law, all such information, software, products, service, and
              related graphics are provided &quot;as is&quot; without warranty or
              condition of any kind.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>14.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane and its service providers, licensors, and suppliers hereby
              disclaim all warranties and conditions of any kind with regard to
              the Platform and the Content, including all implied warranties or
              conditions of merchantability, fitness for a particular purpose,
              title, and non-infringement.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>14.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              No statement or information, whether oral or written, obtained
              from Brane in any means or fashion will create any warranty not
              expressly and explicitly set forth in this agreement.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>14.4</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The Content may include inaccuracies or typographical errors.
            </ThemedText>
          </View>
        </View>

        {/* Section 15: Indemnification and Limitation of Liability */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            15. Indemnification and Limitation of Liability
          </ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>15.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Except to the extent prohibited by any Applicable Law, you agree
              to defend, indemnify, and hold Brane, its subsidiaries, affiliated
              companies, licensors, employees, agents, and any third-party
              information providers, harmless, including costs and legal fees,
              from any claim or demand made by any third party due to or arising
              out of:
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>15.1.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Your use, misuse, or inability to use the Platform or the Content,
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>15.1.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Your violation of these Terms, or
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsubsectionTitle}>15.1.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Your violation of Applicable Laws.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>15.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              To the extent not prohibited by law, in no event shall Brane be
              liable for any direct, indirect, incidental, special, punitive,
              exemplary, indirect, consequential or other types of damages
              whatsoever, including, without limitation, damages for loss of
              profits, loss of data, business interruption or any other
              commercial damages or losses, arising out of or related to your
              use or inability to use the Platform; any information available on
              the Platform; however caused, regardless of the theory of
              liability (contract, tort or otherwise) and even if Brane has been
              advised of the possibility of such damages.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>15.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              In no event shall Brane&apos;s total liability to you for all damages
              (other than as may be required by applicable law in cases
              involving personal injury) exceed ₦5,000 (Five Thousand Naira).
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>15.4</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The foregoing limitations will apply even if the above stated
              remedy fails in its essential purpose.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>15.5</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane reserves the right to control the defense of any matter for
              which you are required to indemnify us, and you agree to cooperate
              with our defense of these claims.
            </ThemedText>
          </View>
        </View>

        {/* Section 16: No Recommendation or Investment Advice */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            16. No Recommendation or Investment Advice
          </ThemedText>
          <ThemedText style={styles.paragraphText}>
            No Content or information on the Platform shall be construed as a
            recommendation or investment advice to a User whatsoever. You
            acknowledge that all transactions and investments are made subject
            to your weighing of the applicable risk involved, and you agree that
            Brane and any of its Affiliates have no liability for any losses
            which you may occur as a result of your reliance on any of the
            Content or information provided or found on the Platform.
          </ThemedText>
        </View>

        {/* Section 17: Updates and Communications */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            17. Updates and Communications
          </ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>17.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane reserves the right, at its sole discretion, to modify the
              Platform, Content and these Terms or any additional terms and
              conditions that are relevant to the Platform from time to time to
              reflect changes in the law or to the Services.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>17.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane will post the revised terms on the Platform with a &quot;Last
              Modification&quot; date. Please review the Platform on a regular basis
              to obtain timely notice of any revisions. If you continue to use
              the Platform after the revisions take effect, you agree to be
              bound by the revised terms. You agree that Brane shall not be
              liable to you or to any third party for any modification of the
              Terms.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>17.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You agree to receive all communications, agreements, newsletters,
              marketing or promotional materials and notices that Brane provides
              in connection with the Services (&quot;Communication&quot;), including, but
              not limited to, Communications related to Brane&apos;s delivery of the
              Services and your purchase of or subscription to the Platform via
              electronic means, including by e-mail, text, in-product
              notifications, or by posting them on the Platform. You agree that
              all Communications that Brane provides to you electronically
              satisfies any legal requirement that such Communications be in
              writing or be delivered in a particular manner and to agree to
              keep your Account contact information current.
            </ThemedText>
          </View>

          <ThemedText style={styles.paragraphText}>
            However, you may opt out of receiving any, or all, of these
            communications from us by following the unsubscribe link or by
            emailing{" "}
            <TouchableOpacity
              onPress={() => handleEmail("info@getbrane.co")}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.link}>info@getbrane.co</ThemedText>
            </TouchableOpacity>
            .
          </ThemedText>
        </View>

        {/* Section 18: Reference to Privacy Policy */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            18. Reference to Privacy Policy
          </ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>18.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane undertakes that it will not sell or rent your Personal Data
              to anyone, for any reason, at any time. Brane uses and discloses
              your Personal Data only as follows:
            </ThemedText>
          </View>

          <View style={styles.listItemContainer}>
            <ThemedText style={styles.listItemText}>
              to analyze usage and improve the Platform,
            </ThemedText>
          </View>

          <View style={styles.listItemContainer}>
            <ThemedText style={styles.listItemText}>
              to deliver to you any administrative notices, alerts and
              communications relevant to your use of the Platform,
            </ThemedText>
          </View>

          <View style={styles.listItemContainer}>
            <ThemedText style={styles.listItemText}>
              to fulfill your requests for Services,
            </ThemedText>
          </View>

          <View style={styles.listItemContainer}>
            <ThemedText style={styles.listItemText}>
              for market research, project planning, troubleshooting problems,
              detecting and protecting against error, fraud or other criminal
              activity in relation to the Platform,
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>18.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Your privacy is important to Brane. Brane has developed a Privacy
              Policy that covers how it collects, uses, discloses, transfers and
              stores your information. For more information, please review our{" "}
              <TouchableOpacity
                onPress={() => router.push('/account/privacy-policy')}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.link}>Privacy Policy</ThemedText>
              </TouchableOpacity>
              .
            </ThemedText>
          </View>
        </View>

        {/* Section 19: Force Majeure */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>19. Force Majeure</ThemedText>
          <ThemedText style={styles.paragraphText}>
            Brane is not liable for any loss incurred by a User due to our delay
            or nonperformance arising out of any cause or event beyond our
            control, including acts of civil or military authority, national
            emergencies, epidemics, pandemics, labor difficulties, fire,
            mechanical breakdown, flood, catastrophe, acts of God, insurrection,
            war, riots, computer failure, communications failure, or power
            failure.
          </ThemedText>
        </View>

        {/* Section 20: Severance */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>20. Severance</ThemedText>
          <ThemedText style={styles.paragraphText}>
            If any provision or part-provision of these Terms is or becomes
            invalid, illegal or unenforceable, it shall be deemed modified to
            the minimum extent necessary to make it valid, legal and
            enforceable. If such modification is not possible, the relevant
            provision or part-provision shall be deemed deleted. Any
            modification to or deletion of a provision or part-provision under
            this paragraph 20 shall not affect the validity and enforceability
            of the rest of these Terms.
          </ThemedText>
        </View>

        {/* Section 21: Waiver */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>21. Waiver</ThemedText>
          <ThemedText style={styles.paragraphText}>
            No waiver by Brane of any term or condition set forth in Terms shall
            be deemed a further or continuing waiver of such term or condition
            or a waiver of any other term or condition, and any failure of Brane
            to assert a right or provision under Terms shall not constitute a
            waiver of such right or provision.
          </ThemedText>
        </View>

        {/* Section 22: Termination */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>22. Termination</ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>22.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Brane may cancel, suspend or block your use of the Platform
              without notice if there has been a violation of these Terms. Your
              right to use the Platform will end once your registration is
              terminated, and any data you have stored on the Platform will be
              deleted, unless Brane is required to retain it by law or for other
              valid business purposes.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>22.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              You may terminate your registration at any time. Brane is not
              responsible or liable for any records or information made
              unavailable to you due to your termination of registration. You
              agree that Brane will not be liable to you or any other party for
              any termination of your access to the Service.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>22.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Upon termination of these Terms, you agree that you will pay to
              Brane all outstanding fees, commission, etc., if any relating to
              your use of the Platform.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>22.4</ThemedText>
            <ThemedText style={styles.paragraphText}>
              If Brane suspends, restricts, limits or terminates your access to
              the Platform or Services pursuant to the above, Brane will use
              commercially reasonable efforts to give you advance notice of
              pending suspension of at least Twenty-Four (24) hours unless Brane
              determines, in its reasonable commercial judgment, that a
              suspension on no or shorter notice is necessary to protect Brane,
              its users, or others. Brane will not be liable for any claims or
              damages of any kind arising out of a reasonable suspension of the
              Platform or Services under this paragraph 22. Brane may maintain a
              suspension of the Platform or Services for as long as reasonably
              necessary to address risks to the Platform, Services or any
              content thereof.
            </ThemedText>
          </View>
        </View>

        {/* Section 23: Governing Law and Jurisdiction */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            23. Governing Law and Jurisdiction
          </ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>23.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              These Terms and any dispute or claim arising out of or in
              connection with it or its subject matter or formation (including
              non-contractual disputes or claims) shall be governed and
              construed in accordance with the laws of the Federal Republic of
              Nigeria.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>23.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The User agrees that any dispute, difference or claim arising out
              of or in connection with these Terms shall be resolved amicably by
              both parties within 30 days through negotiations failing which the
              dispute shall be settled exclusively and finally by Mediation.
              There shall be a mediator appointed by the Director of the Lagos
              Multi-Door Courthouse who shall settle such dispute.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>23.3</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Both Parties agree that the mediator&apos;s decision is final and that
              they shall be bound by same and keep the contents of the mediation
              proceedings strictly confidential.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>23.4</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The language of the mediation shall be English, the venue of the
              mediation shall be Lagos, Nigeria and the cost of the mediation
              proceedings shall be borne by the breaching party as determined by
              the appointed mediator.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>23.5</ThemedText>
            <ThemedText style={styles.paragraphText}>
              The User agrees that Brane and its Affiliates are separate
              entities and are to be treated independently for the purpose of
              any dispute or claim arising from the use of the Platform.
            </ThemedText>
          </View>
        </View>

        {/* Section 24: No-Partnership or Agency */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>
            24. No-Partnership or Agency
          </ThemedText>
          <ThemedText style={styles.paragraphText}>
            No agency, partnership, joint venture, or employment is created as a
            result of these Terms and you do not have any authority of any kind
            to bind Brane in any respect whatsoever; instead, our relationship
            is that of independent contractors.
          </ThemedText>
        </View>

        {/* Section 25: Miscellaneous */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>25. Miscellaneous</ThemedText>

          <View>
            <ThemedText style={styles.subsectionTitle}>25.1</ThemedText>
            <ThemedText style={styles.paragraphText}>
              These Terms create no third-party beneficiary rights to Brane's
              products and Services made available through the Platform.
            </ThemedText>
          </View>

          <View>
            <ThemedText style={styles.subsectionTitle}>25.2</ThemedText>
            <ThemedText style={styles.paragraphText}>
              Section headings are for ease of reference only.
            </ThemedText>
          </View>
        </View>

        {/* Section 26: Contact Us */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>26. Contact Us</ThemedText>
          <ThemedText style={styles.paragraphText}>
            If you have questions or concerns with respect to these Terms,
            please contact us at{" "}
            <TouchableOpacity
              onPress={() => handleEmail('info@getbrane.co')}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.link}>info@getbrane.co</ThemedText>
            </TouchableOpacity>
            .
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsConditions;
