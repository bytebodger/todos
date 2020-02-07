<?php
   session_start();
   require_once 'vendor/autoload.php';
   
   use GraphQL\GraphQL;
   use GraphQL\Type\Definition\ObjectType;
   use GraphQL\Type\Definition\Type;
   use GraphQL\Type\Schema;
   
   $_REQUEST['db'] = mysqli_init();
   mysqli_real_connect($_REQUEST['db'], '127.0.0.1', 'root', '', 'todo') or die('No database connection established.');
   mysqli_set_charset($_REQUEST['db'], 'utf8');
   $_REQUEST['salt'] = 'PtLQ32EdTA';
   if (empty($_SESSION['isLoggedIn'])) {
      $_SESSION['isLoggedIn'] = false;
   }
   if (empty($_SESSION['userId'])) {
      $_SESSION['userId'] = null;
   }
   $login = new ObjectType([
      'name' => 'login',
      'fields' => [
         'isLoginSuccessful' => ['type' => Type::boolean()],
         'sessionId' => ['type' => Type::string()],
         'userId' => ['type' => Type::string()],
         'username' => ['type' => Type::string()],
      ],
   ]);
   $register = new ObjectType([
      'name' => 'register',
      'fields' => [
         'isRegistrationSuccessful' => ['type' => Type::boolean()],
         'sessionId' => ['type' => Type::string()],
         'userId' => ['type' => Type::string()],
         'username' => ['type' => Type::string()],
      ],
   ]);
   $todo = new ObjectType([
      'name' => 'todo',
      'fields' => [
         'todoId' => ['type' => Type::string()],
         'todoListId' => ['type' => Type::string()],
         'description' => ['type' => Type::string()],
         'isComplete' => ['type' => Type::boolean()],
         'sortOrder' => ['type' => Type::int()],
         'priority' => ['type' => Type::string()],
         'dueDate' => ['type' => Type::string()],
      ],
   ]);
   $todoList = new ObjectType([
      'name' => 'todoList',
      'fields' => [
         'todoListId' => ['type' => Type::string()],
         'name' => ['type' => Type::string()],
      ],
   ]);
   $user = new ObjectType([
      'name' => 'user',
      'fields' => [
         'firstName' => ['type' => Type::string()],
         'lastName' => ['type' => Type::string()],
         'middleName' => ['type' => Type::string()],
      ],
   ]);
   $queryType = new ObjectType([
      'name' => 'Queries',
      'fields' => [
         'createTodo' => [
            'args' => [
               'newTodoName' => Type::nonNull(Type::string()),
               'todoListId' => Type::nonNull(Type::string()),
               'sessionId' => Type::nonNull(Type::string()),
               'userId' => Type::nonNull(Type::string()),
            ],
            'type' => $todo,
            'resolve' => function ($root, $args) {
               if (!$_SESSION['isLoggedIn'] or $args['sessionId'] !== session_id() or $_SESSION['userId'] !== $args['userId']) return null;
               $todoId = md5(time() . rand(100000, 999999));
               $escapedUserId = mysqli_real_escape_string($_REQUEST['db'], $args['userId']);
               $escapedTodoListId = mysqli_real_escape_string($_REQUEST['db'], $args['todoListId']);
               $escapedNewTodoName = mysqli_real_escape_string($_REQUEST['db'], $args['newTodoName']);
               $sortOrder = 0;
               $sql = "
                  SELECT
                     MAX(sortOrder) AS highestExistingSortOrder
                  FROM
                     todo
                  WHERE
                     userId = '$escapedUserId'
                  AND
                     todoListId = '$escapedTodoListId'
               ";
               $queryResult = mysqli_query($_REQUEST['db'], $sql);
               if ($queryResult->num_rows) {
                  while ($row = $queryResult->fetch_assoc()) {
                     if ($row['highestExistingSortOrder'] !== null) {
                        $sortOrder = $row['highestExistingSortOrder'] + 1;
                     }
                  }
               }
               $dueDate = date('Y-m-d');
               $sql = "
                  INSERT INTO
                     todo
                  SET
                     todoId = '$todoId'
                     ,userId = '$escapedUserId'
                     ,todoListId = '$escapedTodoListId'
                     ,description = '$escapedNewTodoName'
                     ,isComplete = 0
                     ,sortOrder = $sortOrder
                     ,priority = 'Medium'
                     ,dueDate = '$dueDate'
               ";
               mysqli_query($_REQUEST['db'], $sql);
               return [
                  'todoId' => $todoId,
                  'todoListId' => $args['todoListId'],
                  'description' => $args['newTodoName'],
                  'isComplete' => false,
                  'sortOrder' => $sortOrder,
                  'priority' => 'Medium',
                  'dueDate' => $dueDate,
               ];
            },
         ],
         'createTodoList' => [
            'args' => [
               'newTodoListName' => Type::nonNull(Type::string()),
               'sessionId' => Type::nonNull(Type::string()),
               'userId' => Type::nonNull(Type::string()),
            ],
            'type' => $todoList,
            'resolve' => function ($root, $args) {
               if (!$_SESSION['isLoggedIn'] or $args['sessionId'] !== session_id() or $_SESSION['userId'] !== $args['userId']) return null;
               $escapedUserId = mysqli_real_escape_string($_REQUEST['db'], $args['userId']);
               $todoListId = md5(time() . rand(100000, 999999));
               $escapedNewTodoListName = mysqli_real_escape_string($_REQUEST['db'], $args['newTodoListName']);
               $sql = "
                  INSERT INTO
                     todoList
                  SET
                     todoListId = '$todoListId'
                     ,userId = '$escapedUserId'
                     ,name = '$escapedNewTodoListName'
               ";
               mysqli_query($_REQUEST['db'], $sql);
               return [
                  'todoListId' => $todoListId,
                  'name' => $args['newTodoListName'],
               ];
            },
         ],
         'deleteTodo' => [
            'args' => [
               'todoId' => Type::nonNull(Type::string()),
               'sessionId' => Type::nonNull(Type::string()),
               'userId' => Type::nonNull(Type::string()),
            ],
            'type' => Type::listOf($todo),
            'resolve' => function ($root, $args) {
               if (!$_SESSION['isLoggedIn'] or $args['sessionId'] !== session_id() or $_SESSION['userId'] !== $args['userId']) return null;
               $escapedUserId = mysqli_real_escape_string($_REQUEST['db'], $args['userId']);
               $escapedTodoId = mysqli_real_escape_string($_REQUEST['db'], $args['todoId']);
               $sql = "
                  SELECT
                     todoListId
                     ,sortOrder
                  FROM
                     todo
                  WHERE
                     todoId = '$escapedTodoId'
                  AND
                     userId = '$escapedUserId'
               ";
               $queryResult = mysqli_query($_REQUEST['db'], $sql);
               $sortOrder = 0;
               $todoListId = '';
               while($row = $queryResult->fetch_assoc()) {
                  $todoListId = $row['todoListId'];
                  $sortOrder = $row['sortOrder'];
               }
               $sql = "
                  DELETE FROM
                     todo
                  WHERE
                     todoId = '$escapedTodoId'
                  AND
                     userId = '$escapedUserId'
               ";
               mysqli_query($_REQUEST['db'], $sql);
               $sql = "
                  UPDATE
                     todo
                  SET
                     sortOrder = sortOrder - 1
                  WHERE
                     sortOrder > $sortOrder
                  AND
                     todoListId = '$todoListId'
               ";
               mysqli_query($_REQUEST['db'], $sql);
               $sql = "
                  SELECT
                     todoId
                     ,todoListId
                     ,description
                     ,isComplete
                     ,sortOrder
                     ,priority
                     ,DATE_FORMAT(dueDate, '%Y-%m-%d') AS dueDate
                  FROM
                     todo
                  WHERE
                     userId = '$escapedUserId'
                  ORDER BY
                     todoListId
                     ,sortOrder
               ";
               $queryResult = mysqli_query($_REQUEST['db'], $sql);
               $todos = [];
               if ($queryResult->num_rows) {
                  while ($row = $queryResult->fetch_assoc()) {
                     $todos[] = [
                        'todoId' => $row['todoId'],
                        'todoListId' => $row['todoListId'],
                        'description' => $row['description'],
                        'isComplete' => $row['isComplete'],
                        'sortOrder' => $row['sortOrder'],
                        'priority' => $row['priority'],
                        'dueDate' => $row['dueDate'],
                     ];
                  }
               }
               return $todos;
            }
         ],
         'deleteTodoList' => [
            'args' => [
               'todoListId' => Type::nonNull(Type::string()),
               'sessionId' => Type::nonNull(Type::string()),
               'userId' => Type::nonNull(Type::string()),
            ],
            'type' => $todoList,
            'resolve' => function ($root, $args) {
               if (!$_SESSION['isLoggedIn'] or $args['sessionId'] !== session_id() or $_SESSION['userId'] !== $args['userId']) return null;
               $escapedUserId = mysqli_real_escape_string($_REQUEST['db'], $args['userId']);
               $escapedTodoListId = mysqli_real_escape_string($_REQUEST['db'], $args['todoListId']);
               $sql = "
                  DELETE FROM
                     todo
                  WHERE
                     todoListId = '$escapedTodoListId'
                  AND
                     userId = '$escapedUserId'
               ";
               mysqli_query($_REQUEST['db'], $sql);
               $sql = "
                  DELETE FROM
                     todoList
                  WHERE
                     todoListId = '$escapedTodoListId'
                  AND
                     userId = '$escapedUserId'
               ";
               mysqli_query($_REQUEST['db'], $sql);
               return [
                  'todoListId' => $args['todoListId'],
               ];
            },
         ],
         'getTodoLists' => [
            'args' => [
               'sessionId' => Type::nonNull(Type::string()),
               'userId' => Type::nonNull(Type::string()),
            ],
            'type' => Type::listOf($todoList),
            'resolve' => function ($root, $args) {
               if (!$_SESSION['isLoggedIn'] or $args['sessionId'] !== session_id() or $_SESSION['userId'] !== $args['userId']) return null;
               $escapedUserId = mysqli_real_escape_string($_REQUEST['db'], $args['userId']);
               $sql = "
                  SELECT
                     todoListId
                     ,name
                  FROM
                     todoList
                  WHERE
                     userId = '$escapedUserId'
                  ORDER BY
                     name
               ";
               $queryResult = mysqli_query($_REQUEST['db'], $sql);
               $todoLists = [];
               if ($queryResult->num_rows) {
                  while ($row = $queryResult->fetch_assoc()) {
                     $todoLists[] = [
                        'todoListId' => $row['todoListId'],
                        'name' => $row['name'],
                     ];
                  }
               }
               return $todoLists;
            },
         ],
         'getTodos' => [
            'args' => [
               'sessionId' => Type::nonNull(Type::string()),
               'userId' => Type::nonNull(Type::string()),
            ],
            'type' => Type::listOf($todo),
            'resolve' => function ($root, $args) {
               if (!$_SESSION['isLoggedIn'] or $args['sessionId'] !== session_id() or $_SESSION['userId'] !== $args['userId']) return null;
               $escapedUserId = mysqli_real_escape_string($_REQUEST['db'], $args['userId']);
               $sql = "
                  SELECT
                     todoId
                     ,todoListId
                     ,description
                     ,isComplete
                     ,sortOrder
                     ,priority
                     ,DATE_FORMAT(dueDate, '%Y-%m-%d') AS dueDate
                  FROM
                     todo
                  WHERE
                     userId = '$escapedUserId'
                  ORDER BY
                     todoListId
                     ,sortOrder
               ";
               $queryResult = mysqli_query($_REQUEST['db'], $sql);
               $todos = [];
               if ($queryResult->num_rows) {
                  while ($row = $queryResult->fetch_assoc()) {
                     $todos[] = [
                        'todoId' => $row['todoId'],
                        'todoListId' => $row['todoListId'],
                        'description' => $row['description'],
                        'isComplete' => $row['isComplete'],
                        'sortOrder' => $row['sortOrder'],
                        'priority' => $row['priority'],
                        'dueDate' => $row['dueDate'],
                     ];
                  }
               }
               return $todos;
            },
         ],
         'login' => [
            'args' => [
               'username' => Type::nonNull(Type::string()),
               'password' => Type::nonNull(Type::string()),
            ],
            'type' => $login,
            'resolve' => function ($root, $args) {
               $hashedPassword = md5($_REQUEST['salt'] . $args['password']);
               $username = $args['username'];
               $escapedUsername = mysqli_real_escape_string($_REQUEST['db'], $args['username']);
               if ($args['username'] === 'GUEST-WKHTkVatv8' && $args['password'] === 'GUEST-WKHTkVatv8') {
                  $userId = md5(time() . rand(100000, 999999));
                  $escapedUsername = 'GUEST';
                  $hashedPassword = md5(time() . rand(100000, 999999));
                  $sql = "
                     INSERT INTO
                        user
                     SET
                        userId = '$userId'
                        ,username = '$escapedUsername'
                        ,password = '$hashedPassword'
                  ";
                  mysqli_query($_REQUEST['db'], $sql);
               }
               $sql = "
						SELECT
							userId
							,username
						FROM
							user
						WHERE
							username = '$escapedUsername'
						AND
							password = '$hashedPassword'
						LIMIT 1
					";
               $queryResult = mysqli_query($_REQUEST['db'], $sql);
               $userId = null;
               $isLoginSuccessful = false;
               $sessionId = null;
               if ($queryResult->num_rows) {
                  while ($row = $queryResult->fetch_assoc()) {
                     $userId = $row['userId'];
                     $username = $row['username'];
                  }
                  $isLoginSuccessful = true;
                  $sessionId = session_id();
                  $_SESSION['isLoggedIn'] = true;
                  $_SESSION['userId'] = $userId;
               } else {
                  $_SESSION['isLoggedIn'] = false;
                  $_SESSION['userId'] = null;
               }
               return [
                  'isLoginSuccessful' => $isLoginSuccessful,
                  'sessionId' => $sessionId,
                  'userId' => $userId,
                  'username' => $username,
               ];
            },
         ],
         'moveTodo' => [
            'args' => [
               'todoId' => Type::nonNull(Type::string()),
               'todoListId' => Type::nonNull(Type::string()),
               'movedFromIndex' => Type::nonNull(Type::int()),
               'movedToIndex' => Type::nonNull(Type::int()),
               'sessionId' => Type::nonNull(Type::string()),
               'userId' => Type::nonNull(Type::string()),
            ],
            'type' => Type::listOf($todo),
            'resolve' => function ($root, $args) {
               if (!$_SESSION['isLoggedIn'] or $args['sessionId'] !== session_id() or $_SESSION['userId'] !== $args['userId']) return null;
               $escapedUserId = mysqli_real_escape_string($_REQUEST['db'], $args['userId']);
               $escapedTodoId = mysqli_real_escape_string($_REQUEST['db'], $args['todoId']);
               $escapedTodoListId = mysqli_real_escape_string($_REQUEST['db'], $args['todoListId']);
               $movedFromIndex = $args['movedFromIndex'];
               $movedToIndex = $args['movedToIndex'];
               if ($movedFromIndex < $movedToIndex) {
                  // moving UP
                  $sql = "
                     UPDATE
                        todo
                     SET
                        sortOrder = sortOrder - 1
                     WHERE
                        userId = '$escapedUserId'
                     AND
                        todoListId = '$escapedTodoListId'
                     AND
                        sortOrder > $movedFromIndex
                     AND
                        sortOrder <= $movedToIndex
                  ";
                  mysqli_query($_REQUEST['db'], $sql);
               } elseif ($movedFromIndex > $movedToIndex) {
                  // moving DOWN
                  $sql = "
                     UPDATE
                        todo
                     SET
                        sortOrder = sortOrder + 1
                     WHERE
                        userId = '$escapedUserId'
                     AND
                        todoListId = '$escapedTodoListId'
                     AND
                        sortOrder >= $movedToIndex
                     AND
                        sortOrder < $movedFromIndex
                  ";
                  mysqli_query($_REQUEST['db'], $sql);
               }
               $sql = "
                     UPDATE
                        todo
                     SET
                        sortOrder = $movedToIndex
                     WHERE
                        userId = '$escapedUserId'
                     AND
                        todoListId = '$escapedTodoListId'
                     AND
                        todoId = '$escapedTodoId'
                  ";
               mysqli_query($_REQUEST['db'], $sql);
               $sql = "
                  SELECT
                     todoId
                     ,todoListId
                     ,description
                     ,isComplete
                     ,sortOrder
                     ,priority
                     ,DATE_FORMAT(dueDate, '%Y-%m-%d') AS dueDate
                  FROM
                     todo
                  WHERE
                     userId = '$escapedUserId'
                  ORDER BY
                     todoListId
                     ,sortOrder
               ";
               $queryResult = mysqli_query($_REQUEST['db'], $sql);
               $todos = [];
               if ($queryResult->num_rows) {
                  while ($row = $queryResult->fetch_assoc()) {
                     $todos[] = [
                        'todoId' => $row['todoId'],
                        'todoListId' => $row['todoListId'],
                        'description' => $row['description'],
                        'isComplete' => $row['isComplete'],
                        'sortOrder' => $row['sortOrder'],
                        'priority' => $row['priority'],
                        'dueDate' => $row['dueDate'],
                     ];
                  }
               }
               return $todos;
            },
         ],
         'register' => [
            'args' => [
               'username' => Type::nonNull(Type::string()),
               'password' => Type::nonNull(Type::string()),
            ],
            'type' => $register,
            'resolve' => function ($root, $args) {
               $hashedPassword = md5($_REQUEST['salt'] . $args['password']);
               $username = $args['username'];
               $escapedUsername = mysqli_real_escape_string($_REQUEST['db'], $args['username']);
               $isRegistrationSuccessful = false;
               $sql = "
						SELECT
							userId
							,username
						FROM
							user
						WHERE
							username = '$escapedUsername'
						AND
							password = '$hashedPassword'
						LIMIT 1
					";
               $queryResult = mysqli_query($_REQUEST['db'], $sql);
               if ($queryResult->num_rows === 0) {
                  $userId = md5(time() . rand(100000, 999999));
                  $sql = "
                     INSERT INTO
                        user
                     SET
                        userId = '$userId'
                        ,username = '$escapedUsername'
                        ,password = '$hashedPassword'
                  ";
                  mysqli_query($_REQUEST['db'], $sql);
                  $sessionId = session_id();
                  $isRegistrationSuccessful = true;
                  $_SESSION['isLoggedIn'] = true;
                  $_SESSION['userId'] = $userId;
               } else {
                  $userId = null;
                  $username = null;
                  $sessionId = null;
                  $_SESSION['isLoggedIn'] = false;
                  $_SESSION['userId'] = null;
               }
               return [
                  'isRegistrationSuccessful' => $isRegistrationSuccessful,
                  'sessionId' => $sessionId,
                  'userId' => $userId,
                  'username' => $username,
               ];
            },
         ],
         'sortTodos' => [
            'args' => [
               'todoListId' => Type::nonNull(Type::string()),
               'sortBy' => Type::nonNull(Type::string()),
               'sessionId' => Type::nonNull(Type::string()),
               'userId' => Type::nonNull(Type::string()),
            ],
            'type' => Type::listOf($todo),
            'resolve' => function ($root, $args) {
               if (!$_SESSION['isLoggedIn'] or $args['sessionId'] !== session_id() or $_SESSION['userId'] !== $args['userId']) return null;
               $escapedUserId = mysqli_real_escape_string($_REQUEST['db'], $args['userId']);
               $escapedTodoListId = mysqli_real_escape_string($_REQUEST['db'], $args['todoListId']);
               $escapedSortBy = mysqli_real_escape_string($_REQUEST['db'], $args['sortBy']);
               $sql = '';
               if ($escapedSortBy === 'priority') {
                  $sql = "
                     SELECT
                        todoId
                        ,sortOrder
                        ,CASE
                           WHEN priority = 'High' THEN 3
                           WHEN priority = 'Medium' THEN 2
                           WHEN priority = 'Low' THEN 1
                        END AS numericPriority
                     FROM
                        todo
                     WHERE
                        userId = '$escapedUserId'
                     AND
                        todoListId = '$escapedTodoListId'
                     ORDER BY
                        numericPriority DESC
                        ,description
                  ";
               } elseif ($escapedSortBy === 'dueDate') {
                  $sql = "
                     SELECT
                        todoId
                        ,sortOrder
                     FROM
                        todo
                     WHERE
                        userId = '$escapedUserId'
                     AND
                        todoListId = '$escapedTodoListId'
                     ORDER BY
                        dueDate
                        ,description
                  ";
               }
               $queryResult = mysqli_query($_REQUEST['db'], $sql);
               $sortOrder = 0;
               while ($row = $queryResult->fetch_assoc()) {
                  $todoId = $row['todoId'];
                  $sql = "
                     UPDATE
                        todo
                     SET
                        sortOrder = $sortOrder
                     WHERE
                        userId = '$escapedUserId'
                     AND
                        todoListId = '$escapedTodoListId'
                     AND
                        todoId = '$todoId'
                  ";
                  mysqli_query($_REQUEST['db'], $sql);
                  $sortOrder++;
               }
               $sql = "
                  SELECT
                     todoId
                     ,todoListId
                     ,description
                     ,isComplete
                     ,sortOrder
                     ,priority
                     ,DATE_FORMAT(dueDate, '%Y-%m-%d') AS dueDate
                  FROM
                     todo
                  WHERE
                     userId = '$escapedUserId'
                  ORDER BY
                     todoListId
                     ,sortOrder
               ";
               $queryResult = mysqli_query($_REQUEST['db'], $sql);
               $todos = [];
               if ($queryResult->num_rows) {
                  while ($row = $queryResult->fetch_assoc()) {
                     $todos[] = [
                        'todoId' => $row['todoId'],
                        'todoListId' => $row['todoListId'],
                        'description' => $row['description'],
                        'isComplete' => $row['isComplete'],
                        'sortOrder' => $row['sortOrder'],
                        'priority' => $row['priority'],
                        'dueDate' => $row['dueDate'],
                     ];
                  }
               }
               return $todos;
            },
         ],
         'updateTodoDescription' => [
            'args' => [
               'description' => Type::nonNull(Type::string()),
               'todoId' => Type::nonNull(Type::string()),
               'sessionId' => Type::nonNull(Type::string()),
               'userId' => Type::nonNull(Type::string()),
            ],
            'type' => $todo,
            'resolve' => function ($root, $args) {
               if (!$_SESSION['isLoggedIn'] or $args['sessionId'] !== session_id() or $_SESSION['userId'] !== $args['userId']) return null;
               $escapedUserId = mysqli_real_escape_string($_REQUEST['db'], $args['userId']);
               $escapedTodoId = mysqli_real_escape_string($_REQUEST['db'], $args['todoId']);
               $escapedDescription = mysqli_real_escape_string($_REQUEST['db'], $args['description']);
               $sql = "
                  UPDATE
                     todo
                  SET
                     description = '$escapedDescription'
                  WHERE
                     todoId = '$escapedTodoId'
                  AND
                     userId = '$escapedUserId'
               ";
               mysqli_query($_REQUEST['db'], $sql);
               return [
                  'todoId' => $args['todoId'],
                  'description' => $args['description'],
               ];
            },
         ],
         'updateTodoDueDate' => [
            'args' => [
               'dueDate' => Type::nonNull(Type::string()),
               'todoId' => Type::nonNull(Type::string()),
               'sessionId' => Type::nonNull(Type::string()),
               'userId' => Type::nonNull(Type::string()),
            ],
            'type' => $todo,
            'resolve' => function ($root, $args) {
               if (!$_SESSION['isLoggedIn'] or $args['sessionId'] !== session_id() or $_SESSION['userId'] !== $args['userId']) return null;
               $escapedUserId = mysqli_real_escape_string($_REQUEST['db'], $args['userId']);
               $escapedTodoId = mysqli_real_escape_string($_REQUEST['db'], $args['todoId']);
               $escapedDueDate = mysqli_real_escape_string($_REQUEST['db'], $args['dueDate']);
               $sql = "
                  UPDATE
                     todo
                  SET
                     dueDate = '$escapedDueDate'
                  WHERE
                     todoId = '$escapedTodoId'
                  AND
                     userId = '$escapedUserId'
               ";
               mysqli_query($_REQUEST['db'], $sql);
               return [
                  'todoId' => $args['todoId'],
                  'dueDate' => $args['dueDate'],
               ];
            },
         ],
         'updateTodoIsComplete' => [
            'args' => [
               'todoId' => Type::nonNull(Type::string()),
               'isComplete' => Type::nonNull(Type::boolean()),
               'sessionId' => Type::nonNull(Type::string()),
               'userId' => Type::nonNull(Type::string()),
            ],
            'type' => $todo,
            'resolve' => function ($root, $args) {
               if (!$_SESSION['isLoggedIn'] or $args['sessionId'] !== session_id() or $_SESSION['userId'] !== $args['userId']) return null;
               $escapedUserId = mysqli_real_escape_string($_REQUEST['db'], $args['userId']);
               $escapedTodoId = mysqli_real_escape_string($_REQUEST['db'], $args['todoId']);
               $isComplete = $args['isComplete'] ? 1 : 0;
               $sql = "
                  UPDATE
                     todo
                  SET
                     isComplete = $isComplete
                  WHERE
                     todoId = '$escapedTodoId'
                  AND
                     userId = '$escapedUserId'
               ";
               mysqli_query($_REQUEST['db'], $sql);
               return [
                  'todoId' => $args['todoId'],
                  'isComplete' => $args['isComplete'],
               ];
            },
         ],
         'updateTodoListName' => [
            'args' => [
               'name' => Type::nonNull(Type::string()),
               'todoListId' => Type::nonNull(Type::string()),
               'sessionId' => Type::nonNull(Type::string()),
               'userId' => Type::nonNull(Type::string()),
            ],
            'type' => $todoList,
            'resolve' => function ($root, $args) {
               if (!$_SESSION['isLoggedIn'] or $args['sessionId'] !== session_id() or $_SESSION['userId'] !== $args['userId']) return null;
               $escapedUserId = mysqli_real_escape_string($_REQUEST['db'], $args['userId']);
               $escapedTodoListId = mysqli_real_escape_string($_REQUEST['db'], $args['todoListId']);
               $escapedName = mysqli_real_escape_string($_REQUEST['db'], $args['name']);
               $sql = "
                  UPDATE
                     todoList
                  SET
                     name = '$escapedName'
                  WHERE
                     todoListId = '$escapedTodoListId'
                  AND
                     userId = '$escapedUserId'
               ";
               mysqli_query($_REQUEST['db'], $sql);
               return [
                  'todoListId' => $args['todoListId'],
                  'name' => $args['name'],
               ];
            },
         ],
         'updateTodoPriority' => [
            'args' => [
               'todoId' => Type::nonNull(Type::string()),
               'priority' => Type::nonNull(Type::string()),
               'sessionId' => Type::nonNull(Type::string()),
               'userId' => Type::nonNull(Type::string()),
            ],
            'type' => $todo,
            'resolve' => function ($root, $args) {
               if (!$_SESSION['isLoggedIn'] or $args['sessionId'] !== session_id() or $_SESSION['userId'] !== $args['userId']) return null;
               $escapedUserId = mysqli_real_escape_string($_REQUEST['db'], $args['userId']);
               $escapedTodoId = mysqli_real_escape_string($_REQUEST['db'], $args['todoId']);
               $escapedPriority = mysqli_real_escape_string($_REQUEST['db'], $args['priority']);
               $sql = "
                  UPDATE
                     todo
                  SET
                     priority = '$escapedPriority'
                  WHERE
                     todoId = '$escapedTodoId'
                  AND
                     userId = '$escapedUserId'
               ";
               mysqli_query($_REQUEST['db'], $sql);
               return [
                  'todoId' => $args['todoId'],
                  'priority' => $args['priority'],
               ];
            },
         ],
      ],
   ]);
   $schema = new Schema([
      'query' => $queryType
   ]);
   $rawInput = file_get_contents('php://input');
   //$createTodoListInput = '{"query": "query { createTodoList(newTodoListName: \"list1\", userId: \"fc9c01721b14db38bf16fb4ca913e55c\", sessionId: \"nlq5660gq2gr7a298uu42bk4au\") { todoListId, name } }" }';
   $input = json_decode($rawInput, true);
   $query = $input['query'];
   try {
      $result = GraphQL::executeQuery($schema, $query);
      $output = $result->toArray();
   } catch (Exception $e) {
      $output = [
         'errors' => [
            [
               'message' => $e->getMessage()
            ]
         ]
      ];
   }
   header('Content-Type: application/json');
   echo json_encode($output);
?>