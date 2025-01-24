const express = require('express');
const router = express.Router();
const Database = require('../utils/database');
const db = new Database();
const { DynamoDBClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

  // 회원가입 라우트
  router.post('/register', async (req, res) => {
    try {
      const { email, cognitoId } = req.body;

      if (!email || !cognitoId) {
        return res.status(400).json({ message: '필수 데이터가 누락되었습니다.' });
      }

      // 중복 이메일 확인
      const existingUsers = await db.queryItems({
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      });

      if (existingUsers.Items.length > 0) {
        return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
      }

      // 사용자 데이터 삽입
      await db.createUser({
        userId: cognitoId.toString(),
        email,
        createdAt: new Date().toISOString(),
      });

      res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
      console.error('회원가입 에러:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
  });

  // 로그인 라우트
  router.post('/login', async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: '이메일이 누락되었습니다.' });
      }

      // 사용자 조회
      const users = await db.queryItems({
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      });

      if (users.Items.length === 0) {
        return res.status(401).json({ message: '등록되지 않은 사용자입니다.' });
      }

      res.json({ userId: users.Items[0].userId, message: '로그인 성공' });
    } catch (error) {
      console.error('로그인 에러:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
  });


  router.get('/user/:email', async (req, res) => {
    try {
      const { email } = req.params;
      console.log('사용자 정보 조회 요청:', email);

      const params = {
        TableName: 'AuthTable', // DynamoDB 테이블 이름
        Key: {
          email, // Primary Key로 사용자 ID 사용
        },
      };

      console.log('DynamoDB 조회 파라미터:', params);
      const result = await dynamoDB.send(new GetCommand(params));
      console.log('DynamoDB 조회 결과:', result);

      if (!result.Item) {
        // 사용자가 없으면 기본 정보로 새로 생성
        const newUser = {
          // sub: userId,
          // email: req.query.email || '', // 쿼리로 이메일 전달받음
          email,
          createdAt: new Date().toISOString(),
        };

        await dynamoDB.send(new PutCommand({
          TableName: 'AuthTable',
          Item: newUser,
        }));

        return res.status(200).json({
          success: true,
          user: newUser,
        });
      }

      res.status(200).json({
        success: true,
        user: result.Item,
      });
    } catch (error) {
      console.error('사용자 조회/저장 에러:', error);
      res.status(500).json({
        success: false,
        message: '사용자 정보 처리에 실패했습니다.',
        error: error.message,
      });
    }
  });
  module.exports = router;
