---
title: "Concurrent Processing in C#"
date: "2023-08-17"
description: "Learn concurrent processing through hands-on C# development. Explore SemaphoreSlim, task management, and best practices for building scalable multi-threaded applications."
tags: ["C#", "Concurrent Programming", "Async", "Performance", "Architecture"]
author: "Mark Hazleton"
slug: "concurrent-processing"
keywords: "concurrent processing, C#, SemaphoreSlim, async programming, multithreading, task parallelism, thread safety, scalability"
estimatedReadTime: 12
img_src: "/img/ArgostoliGreeceBeach.jpg"
---

# Concurrent Processing in C#

**Learning Concurrent Processing Through Code**

> View the complete source code on GitHub: [ConcurrentProcessing Repository](https://github.com/markhazleton/concurrentprocessing/)

As a developer, one of the most exciting aspects of programming is the opportunity to learn new concepts and techniques. Recently, I embarked on a journey to understand concurrent processing better, and I'm excited to share my experience with you.

The idea of managing multiple tasks simultaneously has always fascinated me. However, it can be a complex challenge, requiring synchronization and careful management to avoid issues like race conditions and deadlocks. To dive into this topic, I decided to develop a C# console application that would allow me to experiment and learn practically.

## Considerations for Concurrent Processing

### Task Autonomy and Independence

For multiple tasks to effectively run concurrently, each task must encapsulate an autonomous and self-contained unit of functionality. Autonomy ensures that a task operates independently, free from unnecessary dependencies on other tasks or shared resources.

### Synchronization

Ensuring proper synchronization is crucial to prevent race conditions and ensure data consistency among multiple threads or tasks. Techniques like locks, semaphores, and monitors can be used to control access to shared resources.

### Scalability

Consider the scalability of your concurrent processing solution. Will it perform well as the number of concurrent tasks or threads increases? Design your system to handle increased load without degrading performance.

### Deadlocks and Livelocks

Be aware of potential deadlocks and livelocks that can occur when multiple threads are waiting for resources that are held by other threads. Avoid circular dependencies and ensure proper resource allocation/release.

### Resource Management

Properly manage resources such as memory, file handles, and network connections. Failing to release resources can lead to resource exhaustion and degrade system performance.

### Thread Safety

Ensure that your code is thread-safe. Thread safety means that the behavior of a program remains consistent when multiple threads are executing simultaneously. Use techniques like immutable data, synchronization, and thread-local storage.

### Load Balancing

Distribute tasks evenly among threads or processing units to ensure efficient utilization of resources. Load balancing helps prevent scenarios where some threads are idle while others are overloaded.

### Task Granularity

Determine the appropriate level of task granularity. Too fine-grained tasks can lead to overhead due to thread management, while too coarse-grained tasks might not fully utilize available resources.

### Error Handling

Implement robust error-handling mechanisms for concurrent tasks. Unhandled exceptions in one task should not crash the entire application.

### Testing and Debugging

Testing concurrent code is challenging. Consider using techniques like stress testing and race condition detection tools to identify issues. Debugging concurrent issues can be complex.

### Communication and Coordination

Threads or tasks might need to communicate and coordinate with each other. Consider using mechanisms like message queues, shared memory, and events to facilitate inter-thread communication.

## Potential Drawbacks in Concurrent Programming

While concurrent programming boosts performance and resource utilization, it comes with challenges:

- **Risk of Deadlocks and Livelocks**: Multiple threads waiting for each other can cause system freezes
- **Difficulty in Debugging and Testing**: Race conditions and timing issues are hard to reproduce
- **Potential for Race Conditions**: Unsynchronized access to shared data can corrupt state
- **Increased Memory Consumption**: Each thread requires its own stack space
- **Complexity in Code Management and Maintenance**: Concurrent code is harder to reason about and modify

By understanding these challenges, developers can employ strategies to mitigate risks and harness the benefits of concurrency in their projects.

## Building the Concurrent Processing Demo

Since this was a one-off project, I didn't want to spend too much time on the user interface. I created a repository to create a simple console application that would allow me to focus on the core functionality.

[View the Concurrent Processing C# Project on GitHub](https://github.com/markhazleton/ConcurrentProcessing)

I started with a ChatGPT prompt that introduced me to the basics of concurrent processing. Armed with this initial guidance, I started writing the code. Before long I had the basic scaffolding in place, and I was ready to start iterating and learning.

### Core Concurrent Processing Logic

```csharp
const int maxConcurrency = 100; // Maximum concurrent tasks allowed
SemaphoreSlim semaphore = new(maxConcurrency);
List<Task> tasks = new();
int? taskId = 0;

while (taskId is not null)
{
    Task task = ProcessAsync(taskId.Value, tasks.Count, await AwaitSemaphoreAsync(semaphore), semaphore);
    tasks.Add(task);
    taskId = GetNextTaskId(taskId);

    if (tasks.Count >= maxConcurrency)
    {
        Task finishedTask = await Task.WhenAny(tasks);
        tasks.Remove(finishedTask);
    }
}

await Task.WhenAll(tasks);
```

I created a function to wait for a semaphore to be released and added some telemetry to track the time spent waiting.

### Semaphore Wait Function

```csharp
// Wait for semaphore to be released so that next task can start
static async Task<long> AwaitSemaphoreAsync(SemaphoreSlim semaphore)
{
    Stopwatch stopwatch = Stopwatch.StartNew();
    await semaphore.WaitAsync();
    stopwatch.Stop();
    return stopwatch.ElapsedTicks;
}
```

I created a mock async processing method that simulates work by delaying for a random amount of time. I also added telemetry data so that I could track the task ID, task count, semaphore count, and wait time. I used the `Task.Delay` method to simulate work, but in a real-world application, this would be replaced with actual work.

### Mock Processing Task

```csharp
// Mock Async Task to simulate work
static async Task ProcessAsync(int taskId, int taskCount, long waitTicks, SemaphoreSlim semaphore)
{
    try
    {
        await Task.Delay(TimeSpan.FromMilliseconds(new Random().Next(1, 500)));
        Console.WriteLine($"Task:{taskId:D3} T:{taskCount} S:{semaphore.CurrentCount} W:{waitTicks}");
    }
    finally
    {
        semaphore.Release();
    }
}
```

Finally, I created a function to generate the next task ID. This is how I controlled the number of tasks that were created.

### Task ID Generator

```csharp
// Get Next Task ID
static int? GetNextTaskId(int? taskId)
{
    if (taskId < 1000) return taskId + 1;
    else return null;
}
```

## Understanding Task.WhenAll vs Task.WhenAny

One of the key insights from building this application was understanding when to use `Task.WhenAll` versus `Task.WhenAny`, and more importantly, how to handle failures gracefully in concurrent scenarios.

### Task.WhenAny: Managing Active Task Limits

In the main processing loop, we use `Task.WhenAny` to maintain a maximum number of concurrent tasks:

```csharp
if (tasks.Count >= maxConcurrency)
{
    Task finishedTask = await Task.WhenAny(tasks);
    tasks.Remove(finishedTask);
}
```

**Task.WhenAny** returns as soon as **any one** task completes (successfully or with an exception). This allows us to:
- Keep the active task count at or below our maximum
- Process tasks in a rolling window pattern
- Maintain system resource limits without blocking new work

### Task.WhenAll: Ensuring Complete Execution

After the loop, we use `Task.WhenAll` to wait for all remaining tasks:

```csharp
await Task.WhenAll(tasks);
```

**Task.WhenAll** waits for **all tasks** to complete before continuing. However, there's a critical caveat: if any task throws an exception, `Task.WhenAll` will throw an `AggregateException` containing all the exceptions, but **only after all tasks complete**.

### The Black Box Problem: Handling Individual Task Failures

The challenge with `Task.WhenAll` is that failed tasks can become a "black box" - you lose visibility into which specific tasks failed and why. Here's how to solve this:

#### Approach 1: Wrapper with Try-Catch and Logging

```csharp
static async Task SafeProcessAsync(int taskId, int taskCount, long waitTicks, SemaphoreSlim semaphore)
{
    try
    {
        await ProcessAsync(taskId, taskCount, waitTicks, semaphore);
    }
    catch (Exception ex)
    {
        // Log the failure with full context
        Console.WriteLine($"Task {taskId} FAILED: {ex.Message}");
        // Optionally: Log to telemetry system, database, etc.
        // DO NOT rethrow - this prevents one failure from masking others
    }
}
```

#### Approach 2: Return Results with Status

```csharp
public class TaskResult
{
    public int TaskId { get; set; }
    public bool Success { get; set; }
    public Exception? Error { get; set; }
    public long ElapsedTicks { get; set; }
}

static async Task<TaskResult> ProcessWithResultAsync(int taskId, int taskCount, long waitTicks, SemaphoreSlim semaphore)
{
    var result = new TaskResult { TaskId = taskId };
    try
    {
        var stopwatch = Stopwatch.StartNew();
        await Task.Delay(TimeSpan.FromMilliseconds(new Random().Next(1, 500)));
        stopwatch.Stop();
        
        result.Success = true;
        result.ElapsedTicks = stopwatch.ElapsedTicks;
        Console.WriteLine($"Task:{taskId:D3} SUCCESS T:{taskCount} S:{semaphore.CurrentCount}");
    }
    catch (Exception ex)
    {
        result.Success = false;
        result.Error = ex;
        Console.WriteLine($"Task:{taskId:D3} FAILED: {ex.Message}");
    }
    finally
    {
        semaphore.Release();
    }
    return result;
}
```

Then collect and analyze results:

```csharp
// Change Task list to Task<TaskResult>
List<Task<TaskResult>> tasks = new();

// ... add tasks ...

// Wait for all to complete
TaskResult[] results = await Task.WhenAll(tasks);

// Analyze results
var successful = results.Count(r => r.Success);
var failed = results.Count(r => !r.Success);
Console.WriteLine($"\nCompleted: {successful} succeeded, {failed} failed");

// Log detailed failure information
foreach (var failure in results.Where(r => !r.Success))
{
    Console.WriteLine($"Task {failure.TaskId} error: {failure.Error?.Message}");
}
```

#### Approach 3: Handle WhenAll Exceptions Explicitly

```csharp
try
{
    await Task.WhenAll(tasks);
}
catch (Exception)
{
    // Task.WhenAll wraps exceptions in AggregateException
    // Check each task individually for failures
    foreach (var task in tasks)
    {
        if (task.IsFaulted && task.Exception != null)
        {
            foreach (var ex in task.Exception.InnerExceptions)
            {
                Console.WriteLine($"Task failed with: {ex.Message}");
                // Log to your telemetry system
            }
        }
    }
}
```

### Best Practices for Robust Concurrent Processing

1. **Never Let Exceptions Bubble Silently**: Always log task failures with enough context to diagnose issues
2. **Track Task Identity**: Include task IDs or correlation IDs in all logging
3. **Use Structured Logging**: Log to a centralized system (Application Insights, Serilog, etc.)
4. **Consider Circuit Breakers**: If many tasks fail, stop creating new ones
5. **Monitor Metrics**: Track success/failure rates, execution times, and semaphore wait times
6. **Graceful Degradation**: Design your system to continue processing even when individual tasks fail

### Summary Table: WhenAll vs WhenAny

| Aspect | Task.WhenAll | Task.WhenAny |
|--------|-------------|--------------|
| **Completes When** | All tasks finish | First task finishes |
| **Use Case** | Final synchronization, batch operations | Managing active task limits, racing operations |
| **Exception Handling** | Throws if any task fails (after all complete) | Returns immediately, check task.IsFaulted |
| **Return Value** | Array of all results | The single completed task |
| **Performance** | Waits for slowest task | Returns quickly, processes in rolling window |

By understanding these patterns, you can build concurrent systems that are both powerful and observable, avoiding the "black box" problem where failures go unnoticed.

## Iterating and Learning

As I dove into the code, I realized that understanding concurrent processing goes beyond just knowing how to create threads or tasks. I needed to comprehend the concept of synchronization and how to manage the number of concurrently executing tasks. The code I had started with was a great foundation, but it required iteration and refinement to achieve my goals.

The heart of the application was the use of the **SemaphoreSlim** class, which acted as a gatekeeper to control the number of tasks running concurrently. This was a crucial lesson in managing shared resources and preventing resource exhaustion.

## Experimenting and Observing

With each iteration of the code, I ran the application and observed its behavior. The output of the program provided valuable insights into how tasks were being managed, the time each task spent waiting for a semaphore, and the overall concurrency control.

### Sample Output

```
...
Task:061 T:61 S:2 W:2
Task:070 T:70 S:0 W:4
Task:037 T:37 S:0 W:2
Task:018 T:18 S:3 W:2
Task:023 T:23 S:1 W:2
Task:026 T:26 S:2 W:3
...
```

The output highlighted the dynamic nature of concurrent processing, where tasks were processed and released in a controlled manner, ensuring that the maximum concurrency was maintained while avoiding resource contention.

## Celebrating Success

After several iterations, moments of frustration, and numerous debug sessions, I finally achieved my desired result. The application was now a well-functioning demonstration of concurrent processing, showcasing my newfound understanding of synchronization and resource management.

The journey was not just about the code; it was about the learning process itself. Developing this console application was a great learning tool that allowed me to grasp the intricacies of concurrent processing hands-on. It transformed abstract concepts into tangible knowledge.

## Conclusion

The world of concurrent processing is complex and fascinating. Through the development of this C# console application, I gained valuable insights into managing multiple tasks simultaneously while avoiding common pitfalls. The iterative process of refining the code helped me internalize the concepts and apply them effectively.

I encourage fellow developers to try learning through practical coding. It's one thing to read about a topic, but a whole different experience to see it in action and work through challenges firsthand.

**Happy coding and exploring the world of concurrency!**

## Ready for the Next Level?

Now that you've explored the fundamentals of concurrent processing with SemaphoreSlim, you're ready to tackle more advanced scenarios. Learn how to manage concurrent lists of tasks with different return types, robust error handling, and comprehensive telemetry.

[Explore TaskListProcessor: Advanced Concurrent Operations](/task-list-processor)

## The SemaphoreSlim Class

The **SemaphoreSlim** class in .NET presents a robust solution for fine-tuning resource utilization. This lightweight semaphore is designed for scenarios where wait times are expected to be short, making it ideal for controlling the number of tasks executing in parallel within a single process.

The **SemaphoreSlim** class offers a simple, yet effective way to limit the number of threads that can access a specific resource or a pool of resources concurrently. This is particularly useful in scenarios where you need to throttle the usage of resources like network bandwidth or CPU time, preventing the system from being overwhelmed.

When integrating **SemaphoreSlim** into the Task List Processor, it allows precise control over the number of tasks running simultaneously. By setting the maximum concurrent tasks, we ensure efficient execution without overloading the system, especially crucial in high-load situations.

For more detailed information on **SemaphoreSlim**, its usage, and examples, visit the [Microsoft Documentation on SemaphoreSlim](https://learn.microsoft.com/en-us/dotnet/api/system.threading.semaphoreslim).

### Semaphore vs SemaphoreSlim in .NET

Choose **Semaphore** when you need inter-process synchronization or when dealing with named semaphores for system-wide visibility. Opt for **SemaphoreSlim** for more lightweight, intra-process synchronization where performance and efficiency are key considerations.

#### Semaphore

- **Nature**: A wrapper around the Win32 semaphore object, suitable for local or system-wide named semaphores.
- **Usage**: Ideal for thread synchronization across multiple processes or for inter-process communication.
- **Performance**: Slower and more resource-intensive, relying on the system's kernel mode.
- **Functionality**: Supports system-wide visibility and waiting on multiple semaphores.
- **Example**: Synchronizing resource access across different applications on the same system.
- **Pros**: Visibility across processes, suitable for complex synchronization.
- **Cons**: Heavier, slower, and suitable for long wait times. Involves kernel transitions.

#### SemaphoreSlim

- **Nature**: Lightweight and fast, designed for use within a single process.
- **Usage**: Best for short wait times and scenarios confined to a single process.
- **Performance**: More efficient in memory and speed, using CLR synchronization primitives.
- **Functionality**: Does not support named semaphores or system-wide visibility.
- **Example**: Limiting concurrent calls to an external service in a web server application.
- **Pros**: Faster, more memory-efficient, suited for fine-grained control within an app.
- **Cons**: Not suitable for inter-process communication, lacks system-wide visibility.
