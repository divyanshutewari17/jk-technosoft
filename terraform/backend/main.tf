resource "aws_ecs_cluster" "backend" {
  name = "backend-cluster"
}

resource "aws_ecs_service" "backend" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.backend.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 2
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([{
    name  = "backend"
    image = "123456789012.dkr.ecr.us-east-1.amazonaws.com/backend:latest"
    portMappings = [{
      containerPort = 8080
    }]
  }])
}
