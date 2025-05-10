variables {
  image_sha     = "place_image_sha"
  image_web     = "ghcr.io/sugar-space/web-lisk"
  ghcr_username = "reiyanyan"
  ghcr_password = "ghcr_password"
  build_number  = "run_number"
  mode          = "production"
}

job "job-web-prod" {
  datacenters = ["dc1"]

  group "group-web-prod" {
    count = 3
    network {
      port "http" {
        to = -1
      }
    }

    service {
      name = "service-web-prod"
      port = "http"
    }

    task "task-web-prod" {
      env {
        PORT    = "${NOMAD_PORT_http}"
        NODE_IP = "${NOMAD_IP_http}"
        MODE    = "${var.mode}"
        BUILD_NUMBER = "${var.build_number}"
      }

      driver = "docker"

      config {
        image = "${var.image_web}:${var.image_sha}"
        ports = ["http"]
        auth {
          username       = "${var.ghcr_username}"
          password       = "${var.ghcr_password}"
          server_address = "ghcr.io"
        }
      }
    }
  }
}