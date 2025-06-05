package com.rc;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication

@MapperScan("com.rc.mapper")
public class CronjobBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CronjobBackendApplication.class, args);
	}

}
