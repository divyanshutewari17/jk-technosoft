variable "eks_cluster_name" {
  description = "EKS cluster name"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for EKS"
  type        = list(string)
}
