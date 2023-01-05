


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