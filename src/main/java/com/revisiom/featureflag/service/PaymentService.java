package com.revisiom.featureflag.service;


import com.revisiom.featureflag.annotation.RequireFeature;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    @RequireFeature("NEW_PAYMENT_GATEWAY")
    public String processNewPayment(){
        return "Success! Payment processed via new payment gateway.";
    }
    @RequireFeature("BETA_RECOMMENDATIONS")
    public String getBetaRecommendations(){
        return "This method call should be intercepted and blocked!";
    }
}
