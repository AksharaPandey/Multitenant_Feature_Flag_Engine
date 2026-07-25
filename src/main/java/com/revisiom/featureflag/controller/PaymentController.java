package com.revisiom.featureflag.controller;


import com.revisiom.featureflag.service.PaymentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PaymentController {
    private final PaymentService paymentService;
    public PaymentController(PaymentService paymentService){
        this.paymentService=paymentService;
    }
    @GetMapping("/pay")
    public String pay(){
        return paymentService.processNewPayment();
    }
    @GetMapping("/recommendations")
    public String recommendations(){
        return paymentService.getBetaRecommendations();
    }

}
