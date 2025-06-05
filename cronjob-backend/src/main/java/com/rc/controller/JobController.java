package com.rc.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rc.domain.Job;
import com.rc.dto.R;
import com.rc.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
@Tag(name = "任务管理", description = "任务管理相关接口")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    @Operation(summary = "获取任务列表", description = "分页获取任务列表，支持状态筛选和关键字搜索")
    public R<Page<Job>> list(
            @Parameter(description = "分页参数") Page<Job> page,
            @Parameter(description = "状态筛选") @RequestParam(required = false) Integer status,
            @Parameter(description = "关键字搜索") @RequestParam(required = false) String keyword
    ) {
        Page<Job> pageData = jobService.findByPage(page, status, keyword);
        return R.ok(pageData);
    }

    @PostMapping
    @Operation(summary = "创建任务", description = "创建新的定时任务")
    public R<Job> create(@RequestBody Job job) {
        if (jobService.save(job)) {
            return R.ok(job);
        }
        return R.fail("创建job失败");
    }

    @PutMapping("/{id}")
    @Operation(summary = "修改任务", description = "根据ID修改任务信息")
    public R<Job> update(
            @Parameter(description = "任务ID") @PathVariable Long id, 
            @RequestBody Job job) {
        if (jobService.updateById(job)) {
            return R.ok(job);
        }
        return R.fail("修改job失败");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除任务", description = "根据ID删除任务")
    public R<String> delete(@Parameter(description = "任务ID") @PathVariable Long id) {
        if (jobService.removeById(id)) {
            return R.ok("删除job成功");
        }
        return R.fail("删除job失败");
    }
}
