


-- HOW TO JOIN

-- error  SELECT COUNT(1) FROM `products` JOIN `categories` ;

SELECT COUNT(1) FROM `products` JOIN 
    `categories` ON `products`.`category_sid` = categories.sid

SELECT * FROM `products` JOIN 
    `categories` ON `products`.`category_sid` = categories.sid

SELECT * FROM `categories` JOIN 
    `products`  ON `products`.`category_sid` = categories.sid

SELECT p.*, c.name cate_name FROM `products` p JOIN 
    `categories` c ON p.`category_sid` = c.sid


-- LEFT OUTER JOIN
-- 左邊的table所有資料都要呈現
SELECT p.*, c.name cate_name FROM `products` p 
    LEFT JOIN `categories` c ON p.`category_sid` = c.sid

SELECT * FROM categories c 
  LEFT JOIN products p ON p.`category_sid`=c.sid;


SELECT od.*, p.bookname FROM order_details od
  JOIN products p ON od.product_sid=p.sid
  WHERE od.order_sid=11;

  -- 某個會員買過的所有商品

SELECT * FROM orders o
  JOIN order_details od ON o.sid=od.order_sid
  JOIN products p ON od.product_sid=p.sid
  WHERE o.member_sid=1 GROUP BY p.sid;