package com.rc.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 脚本上传数据传输对象
 */
@Data
public class ScriptUploadDTO {
    
    /**
     * 脚本名称
     */
    @NotBlank(message = "脚本名称不能为空")
    @Size(max = 128, message = "脚本名称长度不能超过128个字符")
    private String name;
    
    /**
     * 脚本描述
     */
    @NotBlank(message = "脚本描述不能为空")
    private String description;
    
    /**
     * 运行环境
     */
    @NotBlank(message = "运行环境不能为空")
    @Size(max = 64, message = "运行环境长度不能超过64个字符")
    private String environment;
    
    /**
     * 运行参数
     */
    private String parameters;
}