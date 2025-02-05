resource "aws_ecs_cluster" "frontend" {
  name = "frontend-cluster"
}

resource "aws_ecs_service" "frontend" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.frontend.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 2
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([{
    name  = "frontend"
    image = "123456789012.dkr.ecr.us-east-1.amazonaws.com/frontend:latest"
    portMappings = [{
      containerPort = 3000
    }]
  }])
}
