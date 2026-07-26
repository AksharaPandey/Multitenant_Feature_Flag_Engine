package com.revisiom.featureflag.controller;

import com.revisiom.featureflag.strategy.SimpleToggleEvaluator;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/flags")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminFlagController {
    private final SimpleToggleEvaluator toggleEvaluator;
    public AdminFlagController(SimpleToggleEvaluator toggleEvaluator){
        this.toggleEvaluator=toggleEvaluator;
    }
    @GetMapping
    public Map<String,Boolean> getAllFlags(){
        return toggleEvaluator.getAllFlags();
    }
    @PostMapping("/toggle")
    public Map<String, Boolean> toggleFlag(@RequestParam String featureKey, @RequestParam boolean isEnabled) {
        toggleEvaluator.toggleFlag(featureKey, isEnabled);
        return toggleEvaluator.getAllFlags();
    }


}
