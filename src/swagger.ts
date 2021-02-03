const host = process.env.SWAGGER_DOMAIN || "localhost:5000";
export default {
  swagger: "2.0",
  info: {
    description: "this is  add one machine  api",
    version: "1.0.0",
    title: "Swagger",
  },
  host: `${host}`,
  basePath: "",
  tags: [
    {
      name: "Auth",
      description: "Everything about machine login",
    },
    {
      name: "Activity",
      description: "Everything about activity",
    },
  ],
  schemes: ["http"],
  paths: {
    "/machineApi/login": {
      post: {
        tags: ["Auth"],
        summary: "machine login",
        description: "",
        operationId: "login",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Pet object that needs to be added to the store",
            required: true,
            schema: {
              $ref: "#/definitions/loginRequest",
            },
          },
        ],
        responses: {
          "200": {
            description: "successful operation",
            schema: {
              $ref: "#/definitions/loginResponse",
            },
          },
        },
      },
    },
    "/machineApi/activitys": {
      get: {
        tags: ["Activty"],
        summary: "Find Activitys",
        description: "",
        operationId: "getActivitys",
        produces: ["application/json"],
        parameters: [
          {
            name: "authorization",
            in: "header",
            description: "token",
            required: true,
            type: "string",
            default:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTIzNTQ3MDMsImRhdGEiOnsidXNlcklkIjoxLCJtYWNoaW5lSWQiOjF9LCJpYXQiOjE2MTIzNTExMDN9.l6ErBZMXQFjEvB3B1OtlA1j4C0CKnv0tXPwL9-hHPw0",
          },
        ],
        responses: {
          "200": {
            description: "successful operation",
            schema: {
              $ref: "#/definitions/activitysResponse",
            },
          },
        },
      },
    },
  },
  definitions: {
    loginRequest: {
      type: "object",
      properties: {
        username: {
          type: "string",
          default: "123",
        },
        password: {
          type: "string",
          default: "123",
        },
        code: {
          type: "string",
          default: "111",
        },
      },
      complete: {
        type: "boolean",
        default: false,
      },
    },
    loginResponse: {
      type: "object",
      properties: {
        token: {
          type: "string",
          default:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTIzNTEwNTgsImRhdGEiOnsidXNlcklkIjoxLCJtYWNoaW5lSWQiOjF9LCJpYXQiOjE2MTIzNDc0NTh9.4h6cgrPRRWBvea-KwMfGc3Yx1a412u0mib1nv8WSHAw",
        },
      },
    },
    activitysResponse: {
      type: "array",
      items: {
        $ref: "#/definitions/activity",
      },
    },
    activity: {
      type: "object",
      properties: {
        id: {
          type: "number",
          default: 1,
        },
        code: {
          type: "string",
          default: "111",
          description: "產品代碼",
        },
        name: {
          type: "string",
          default: "dogs",
          description: "產品名稱",
        },
        images: {
          type: "array",
          items: {
            type: "string",
            default: "http://207.148.113.123/images/ZG9n-1611576458452.jpeg",
          },
          description: "產品圖",
        },
        videos: {
          type: "array",
          items: {
            type: "string",
            default: "http://207.148.113.123/images/ZG9n-1611576458452.jpeg",
          },
          description: "產品影片",
        },
        description: {
          type: "string",
          default: "dogs",
          description: "產品資訊",
        },
        start_at: {
          type: "integer",
          default: 1611576721,
          description: "開始時間",
        },
        end_at: {
          type: "integer",
          default: 1611576721,
          description: "結束時間",
        },
        price: {
          type: "integer",
          default: 1000,
          description: "原價",
        },
        discounts: {
          type: "array",
          items: {
            $ref: "#/definitions/discount",
          },
          description: "打折階層",
        },
        discountPrice: {
          type: "integer",
          default: 1000,
          description: "折扣價",
        },
        linkCount: {
          type: "integer",
          default: 1000,
          description: "連線人數",
        },
        registeredCount: {
          type: "integer",
          default: 1000,
          description: "預購人數",
        },
      },
    },
    discount: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          default: 1,
        },
        level: {
          type: "integer",
          default: 1,
          description: "階層數",
        },
        peopleCount: {
          type: "integer",
          default: 1,
          description: "人數",
        },
        percent: {
          type: "integer",
          default: 1,
          description: "百分比",
        },
        activityId: {
          type: "integer",
          default: 1,
        },
        createdAt: {
          type: "string",
          default: "2021-01-25T12:09:54.962Z",
        },
        updateAt: {
          type: "string",
          default: "2021-01-25T12:09:54.962Z",
        },
      },
    },
  },
};
